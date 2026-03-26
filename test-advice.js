// 测试生活建议函数
// node test-advice.js

// 模拟生活建议函数
function getCarWashAdvice(weatherCode, precipProb) {
  console.log(`[洗车建议] weatherCode=${weatherCode}, precipProb=${precipProb}`);
  if (weatherCode >= 60 && weatherCode <= 69) {
    console.log(`[洗车建议] 不宜洗车（有雨）：weatherCode ${weatherCode} 在 60-69 范围内`);
    return "不宜洗车（有雨）";
  }
  if (precipProb > 50) {
    console.log(`[洗车建议] 不宜洗车（降水概率高）：precipProb ${precipProb} > 50`);
    return "不宜洗车（降水概率高）";
  }
  if (weatherCode === 0 || weatherCode === 1) {
    console.log(`[洗车建议] 适宜洗车（晴天）：weatherCode=${weatherCode}`);
    return "适宜洗车（晴天）";
  }
  console.log(`[洗车建议] 可以洗车：weatherCode=${weatherCode}, precipProb=${precipProb}`);
  return "可以洗车";
}

function getDryingAdvice(weatherCode, humidity) {
  console.log(`[晾晒建议] weatherCode=${weatherCode}, humidity=${humidity}`);
  if (weatherCode >= 60 && weatherCode <= 69) {
    console.log(`[晾晒建议] 不宜晾晒（有雨）：weatherCode ${weatherCode} 在 60-69 范围内`);
    return "不宜晾晒（有雨）";
  }
  if (humidity > 80) {
    console.log(`[晾晒建议] 不宜晾晒（湿度过高）：humidity ${humidity} > 80`);
    return "不宜晾晒（湿度过高）";
  }
  if (weatherCode === 0 || weatherCode === 1) {
    console.log(`[晾晒建议] 非常适宜晾晒：weatherCode=${weatherCode}`);
    return "非常适宜晾晒";
  }
  console.log(`[晾晒建议] 可以晾晒：weatherCode=${weatherCode}, humidity=${humidity}`);
  return "可以晾晒";
}

// 测试福州当前天气
console.log("=== 福州当前天气测试 ===\n");
console.log("测试场景1: 小雨 (weather_code=61)");
console.log("当前温度: 18.9°C");
console.log("当前湿度: 57%");
console.log("今日降水概率: 35%\n");

const carAdvice = getCarWashAdvice(61, 35);
const dryingAdvice = getDryingAdvice(61, 57);

console.log("\n=== 结果 ===");
console.log(`洗车建议: ${carAdvice}`);
console.log(`晾晒建议: ${dryingAdvice}`);

console.log("\n=== 预期结果 ===");
console.log("洗车建议: 不宜洗车（有雨）");
console.log("晾晒建议: 不宜晾晒（有雨）");

console.log("\n=== 其他测试场景 ===");
console.log("\n场景2: 晴天 (weather_code=0)");
console.log(`洗车: ${getCarWashAdvice(0, 10)}`);
console.log(`晾晒: ${getDryingAdvice(0, 50)}`);

console.log("\n场景3: 多云 (weather_code=2)");
console.log(`洗车: ${getCarWashAdvice(2, 30)}`);
console.log(`晾晒: ${getDryingAdvice(2, 60)}`);

console.log("\n场景4: 高湿度 (weather_code=2, humidity=85)");
console.log(`洗车: ${getCarWashAdvice(2, 30)}`);
console.log(`晾晒: ${getDryingAdvice(2, 85)}`);
