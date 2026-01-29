
/**
 * XF Obfuscation Engine v1.3-LEVELS
 * Kernel: Metamorphic Transformation Utility
 */

const generateHex = (len: number) => {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

const getVar = () => `_0x${generateHex(8)}`;

const polymorphicEncode = (str: string) => {
  const seed = Math.floor(Math.random() * 20) + 5;
  const b64 = btoa(str);
  const data = b64.split('').map(c => {
    const code = c.charCodeAt(0) + seed;
    return `\\${code}`;
  }).join('');
  return { data, seed };
};

const generateJunkLogic = (intensity: number) => {
  const junkVar = getVar();
  const junkTable = getVar();
  const templates = [
    `local ${junkVar}=0;for i=1,${Math.floor(Math.random() * 50 * intensity)} do ${junkVar}=${junkVar}+i if ${junkVar}<0 then break end end;`,
    `local ${junkTable}={};for i=1,${Math.min(intensity, 10)} do ${junkTable}[i]=function() return i*2 end end;`,
    `if (function(a) return a*a end)(2) == 5 then local ${getVar()}="unreachable" end;`,
    `local ${junkVar} = string.byte("${generateHex(2)}", 1); ${junkVar} = ${junkVar} + ${Math.floor(Math.random() * intensity)};`,
    `local ${getVar()}, ${getVar()} = ${Math.random()}, ${Math.random()}; ${getVar()}, ${getVar()} = ${getVar()}, ${getVar()};`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

export const obfuscate = (input: string, name: string, counter: number, level: number): string => {
  if (!input.trim()) return "-- ERR_EMPTY_BUFFER";

  // Scale complexity based on level (1-10)
  const junkCount = Math.floor(level * 1.5);
  const flowIntensity = level > 5 ? 2 : 1;

  const env = getVar();
  const state = getVar();
  const vmTable = getVar();
  const decoder = getVar();
  const stack = getVar();

  const { data: encodedPayload, seed } = polymorphicEncode(input);

  // Variable Swap Logic
  const swapLogic = level > 3 ? `local ${getVar()}, ${getVar()} = "${generateHex(4)}", "${generateHex(4)}";` : '';

  const obfuscated = `
local ${env}=getfenv();
local ${vmTable}={};
local ${stack} = {${Math.random()}, "${generateHex(4)}", true};
${Array.from({ length: Math.ceil(junkCount / 2) }, () => generateJunkLogic(level)).join('')}
local function ${decoder}(s, k)
  local d="";
  for i=1,#s,4 do
    local c=tonumber(s:sub(i+1,i+3))-k;
    d=d..string.char(c);
  end
  return d;
end;
${swapLogic}
local ${state} = ${Math.floor(Math.random() * 500) + (level * 10)};
while ${state} ~= -1 do
  if ${state} > ${100 + (level * 5)} then
    ${generateJunkLogic(level)}
    ${state} = 0;
  elseif ${state} == 0 then
    ${vmTable}["ptr"] = "${encodedPayload}";
    ${state} = 2;
  elseif ${state} == 1 then
    ${level > 7 ? generateJunkLogic(level) : ''}
    ${state} = -1;
  elseif ${state} == 2 then
    local _res = ${decoder}(${vmTable}["ptr"], ${seed});
    local _exec = ${env}["\\108\\111\\97\\100\\115\\116\\114\\105\\110\\103"];
    _exec(_res)();
    ${state} = 1;
  else
    ${state} = -1;
  end
end
`.replace(/\s+/g, '').trim();

  const header = `-- [XF_OBFUSCATION_BUILD_${counter}_L${level}]\n`;
  const junkPrefix = Array.from({ length: Math.floor(junkCount / 2) }, () => generateJunkLogic(level)).join('');
  const junkSuffix = Array.from({ length: Math.floor(junkCount / 4) }, () => generateJunkLogic(level)).join('');

  return `${header}${junkPrefix}${obfuscated}${junkSuffix}`;
};
