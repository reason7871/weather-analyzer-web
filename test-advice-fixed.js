// 测试修复后的生活建议函数
// 使用今日预报天气代码而不是当前天气代码

// 模拟生活建议函数
function getCarWashAdvice(weatherCode, precipProb) {
  console.log(`[洗车建议] weatherCode=${weatherCode}, precipProb=${precipProb}`);
  if (weatherCode >= 60 && weatherCode <= 69) {
    console.log(`  → 不宜洗车（有雨）：weatherCode ${weatherCode} 在 60-69 范围内`);
    return "不宜洗车（有雨）";
  }
  if (weatherCode >= 80 && weatherCode <= 82) {
    console.log(`  → 不宜洗车（有阵雨/暴雨）：weatherCode ${weatherCode} 在 80-82 范围内`);
    return "不宜洗车（有雨）";
  }
  if (precipProb > 50) {
    console.log(`  → 不宜洗车（降水概率高）：precipProb ${precipProb} > 50`);
    return "不宜洗车（降水概率高）";
  }
  if (weatherCode === 0 || weatherCode === 1) {
    console.log(`  → 适宜洗车（晴天）：weatherCode=${weatherCode}`);
    return "适宜洗车（晴天）";
  }
  console.log(`  → 可以洗车`);
  return "可以洗车";
}

function getDryingAdvice(weatherCode, humidity) {
  console.log(`[晾晒建议] weatherCode=${weatherCode}, humidity=${humidity}`);
  if (weatherCode >= 60 && weatherCode <= 69) {
    console.log(`  → 不宜晾晒（有雨）：weatherCode ${weatherCode} 在 60-69 范围内`);
    return "不宜晾晒（有雨）";
  }
  if (weatherCode >= 80 && weatherCode <= 82) {
    console.log(`  → 不宜晾晒（有阵雨）：weatherCode ${weatherCode} 在 80-82 范围内`);
    return "不宜晾晒（有雨）";
  }
  if (humidity > 80) {
    console.log(`  → 不宜晾晒（湿度过高）：humidity ${humidity} > 80`);
    return "不宜晾晒（湿度过高）";
  }
  if (weatherCode === 0 || weatherCode === 1) {
    console.log(`  → 非常适宜晾晒：weatherCode=${weatherCode}`);
    return "非常适宜晾晒";
  }
  console.log(`  → 可以晾晒`);
  return "可以晾晒";
}

console.log("=== 福州实际情况 ===\n");
console.log("当前天气代码: 2 (多云)");
console.log("今日预报天气代码: 80 (阵雨)");
console.log("今日降水概率: 30%");
console.log("当前湿度: 60%\n");

console.log("=== 使用当前天气代码（错误） ===");
console.log(`洗车建议: ${getCarWashAdvice(2, 30)}`);
console.log(`晾晒建议: ${getDryingAdvice(2, 60)}\n`);

console.log("=== 使用今日预报天气代码（正确） ===");
console.log(`洗车建议: ${getCarWashAdvice(80, 30)}`);
console.log(`晾晒建议: ${getDryingAdvice(80, 60)}\n`);

console.log("=== 需要添加阵雨代码判断 ===");
console.log("WMO 代码说明：");
console.log("- 60-69: 各种降雨（毛毛雨、小雨、中雨、大雨）");
console.log("- 80-82: 阵雨（阵雨、阵雨、暴雨）");
console.log("- 95-99: 雷暴（雷雨、雷暴）");
