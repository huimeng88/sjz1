class EnhancedDeltaFortuneEngine {
  constructor() {
    this.elementCycle = ['木', '火', '土', '金', '水'];
    this.elementGeneration = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    this.elementDestruction = {
      '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };
    
    // 天干地支
    this.heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    this.earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 添加十二时辰定义
    this.timeSlots = [
      {name: '子时', range: '23:00-01:00', element: '水', meaning: '夜半，一阳生'},
      {name: '丑时', range: '01:00-03:00', element: '土', meaning: '鸡鸣，阴气渐消'},
      {name: '寅时', range: '03:00-05:00', element: '木', meaning: '平旦，阳气初升'},
      {name: '卯时', range: '05:00-07:00', element: '木', meaning: '日出，万物苏醒'},
      {name: '辰时', range: '07:00-09:00', element: '土', meaning: '食时，朝气蓬勃'},
      {name: '巳时', range: '09:00-11:00', element: '火', meaning: '隅中，阳气旺盛'},
      {name: '午时', range: '11:00-13:00', element: '火', meaning: '日中，阳气最盛'},
      {name: '未时', range: '13:00-15:00', element: '土', meaning: '日昳，阳气渐衰'},
      {name: '申时', range: '15:00-17:00', element: '金', meaning: '晡时，凉风习习'},
      {name: '酉时', range: '17:00-19:00', element: '金', meaning: '日入，万物归息'},
      {name: '戌时', range: '19:00-21:00', element: '土', meaning: '黄昏，阴气初生'},
      {name: '亥时', range: '21:00-23:00', element: '水', meaning: '人定，夜深人静'}
    ];
    
    // 奇门遁甲九宫
    this.qimenPalaces = {
      '乾宫': {position: 6, element: '金', meaning: '天门'},
      '坎宫': {position: 1, element: '水', meaning: '生门'},
      '艮宫': {position: 8, element: '土', meaning: '伤门'},
      '震宫': {position: 3, element: '木', meaning: '杜门'},
      '中宫': {position: 5, element: '土', meaning: '中央'},
      '巽宫': {position: 4, element: '木', meaning: '景门'},
      '离宫': {position: 9, element: '火', meaning: '死门'},
      '坤宫': {position: 2, element: '土', meaning: '惊门'},
      '兑宫': {position: 7, element: '金', meaning: '开门'}
    };
    
    // 三角洲皮肤抽奖数据结构
    this.skinDrawSystem = {
      // 人物红皮抽奖系统
      characterSkin: {
        name: '人物红皮',
        type: 'character',
        drawCosts: [1, 3, 5, 10, 15, 20, 25, 30], // 研究券消耗
        guaranteedDraw: 8, // 第8发保底
        baseRedProbability: 0.12, // 基础红皮概率
        element: '火', // 红皮对应火属性
        rewards: {
          red: { name: '红色皮肤', probability: 0.12, color: '#ff0000' },
          gold: { name: '金色奖励', probability: 0.88, color: '#ffd700' }
        }
      },
      // 枪皮抽奖系统
      weaponSkin: {
        name: '曼德尔砖枪皮',
        type: 'weapon',
        categories: {
          premium: { name: '极品', element: '金', baseRate: 0.15 },
          excellent: { name: '优品', element: '银', baseRate: 0.35 }
        },
        qualities: {
          S: { name: 'S级', probability: 0.05, color: '#ff6b35', element: '金' },
          A: { name: 'A级', probability: 0.15, color: '#9b59b6', element: '木' },
          B: { name: 'B级', probability: 0.30, color: '#3498db', element: '水' },
          C: { name: 'C级', probability: 0.50, color: '#95a5a6', element: '土' }
        }
      }
    };
    
    this.operators = null;
    this.maps = null;
    this.containers = null;
    this.dataLoaded = false;
    this.loadData();
  }
  
  async loadJSON(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('加载JSON文件失败:', error);
      return null;
    }
  }
  
  async loadData() {
    try {
      this.operators = await this.loadJSON('./operators_data.json');
      this.maps = await this.loadJSON('./enhanced_map_zones.json');
      this.containers = await this.loadJSON('./containers_data.json');
      this.dataLoaded = true;
      console.log('增强数据加载完成');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataLoaded'));
      }
    } catch (error) {
      console.error('数据加载失败:', error);
    }
  }
  
  isDataLoaded() {
    return this.dataLoaded && this.operators && this.maps && this.containers;
  }
  
  calculateGanZhi(date = new Date()) {
    const baseYear = 1984;
    const year = date.getFullYear();
    const yearOffset = year - baseYear;
    
    const ganIndex = yearOffset % 10;
    const zhiIndex = yearOffset % 12;
    
    const dayOffset = Math.floor((date - new Date(1984, 0, 1)) / (1000 * 60 * 60 * 24));
    const dayGanIndex = dayOffset % 10;
    const dayZhiIndex = dayOffset % 12;
    
    return {
      year: this.heavenlyStems[ganIndex] + this.earthlyBranches[zhiIndex],
      day: this.heavenlyStems[dayGanIndex] + this.earthlyBranches[dayZhiIndex],
      yearElement: this.getGanZhiElement(ganIndex, zhiIndex),
      dayElement: this.getGanZhiElement(dayGanIndex, dayZhiIndex)
    };
  }
  
  getGanZhiElement(ganIndex, zhiIndex) {
    const ganElements = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
    return ganElements[ganIndex];
  }
  
  calculateWealthPosition(operatorElement, date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const dayElement = ganZhi.dayElement;
    
    const wealthPositions = {
      '木': ['西南', '西北'],
      '火': ['西北', '西'],
      '土': ['北', '东北'],
      '金': ['东', '东南'],
      '水': ['南', '西南']
    };
    
    return {
      primary: wealthPositions[operatorElement][0],
      secondary: wealthPositions[operatorElement][1],
      element: this.elementDestruction[operatorElement]
    };
  }
  
  calculateJoyGodPosition(date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const dayGan = ganZhi.day[0];
    
    const joyPositions = {
      '甲': '艮', '乙': '乾', '丙': '坤', '丁': '兑',
      '戊': '坤', '己': '离', '庚': '艮', '辛': '乾',
      '壬': '离', '癸': '坎'
    };
    
    return joyPositions[dayGan] || '中宫';
  }
  
  calculateQimenAnalysis(date = new Date()) {
    const hour = date.getHours();
    const timeIndex = Math.floor(hour / 2);
    
    const analysis = {};
    for (const [palace, data] of Object.entries(this.qimenPalaces)) {
      const timeBonus = (timeIndex + data.position) % 9 === 0 ? 1.3 : 1.0;
      analysis[palace] = {
        ...data,
        timeBonus: timeBonus,
        recommendation: timeBonus > 1.2 ? '大吉' : timeBonus > 1.0 ? '吉' : '平'
      };
    }
    
    return analysis;
  }
  
  calculatePlumBlossomAnalysis(operatorCodename, date = new Date()) {
    const operator = this.operators?.operators.find(op => op.codename === operatorCodename);
    if (!operator) return null;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    
    const upperGua = (year + month + day) % 8;
    const lowerGua = (year + month + day + hour) % 8;
    const changeLine = (year + month + day + hour) % 6;
    
    const guaNames = ['坤', '震', '坎', '兑', '艮', '离', '巽', '乾'];
    const guaElements = ['土', '木', '水', '金', '土', '火', '木', '金'];
    
    return {
      upperGua: guaNames[upperGua],
      lowerGua: guaNames[lowerGua],
      upperElement: guaElements[upperGua],
      lowerElement: guaElements[lowerGua],
      changeLine: changeLine + 1,
      compatibility: this.calculateElementCompatibility(operator.element, guaElements[upperGua]),
      prediction: this.getPlumBlossomPrediction(guaElements[upperGua], guaElements[lowerGua])
    };
  }
  
  getPlumBlossomPrediction(upper, lower) {
    if (this.elementGeneration[lower] === upper) return '吉，下卦生上卦，事业有成';
    if (this.elementGeneration[upper] === lower) return '平，上卦生下卦，需要付出';
    if (this.elementDestruction[upper] === lower) return '凶，上克下，阻力重重';
    if (this.elementDestruction[lower] === upper) return '险，下克上，需防小人';
    return '平，五行平和，按部就班';
  }
  
  // 在 analyzeContainerFortune 方法中，修复第230行左右
  analyzeContainerFortune(operatorElement, date = new Date()) {
    const dayElement = this.getDayElement(date);
    const timeSlot = this.getCurrentTimeSlot(date);
    
    const containerAnalysis = {};
    
    // 修复：使用 Object.values() 来遍历容器对象
    for (const container of Object.values(this.containers.containers)) {
      const elementBonus = this.calculateElementCompatibility(operatorElement, container.element);
      const dayBonus = this.calculateElementCompatibility(dayElement, container.element);
      const timeBonus = this.calculateElementCompatibility(timeSlot.element, container.element);
      
      const totalBonus = (elementBonus + dayBonus + timeBonus) / 3;
      const finalDropRate = container.baseDropRate * totalBonus;
      
      containerAnalysis[container.name] = {
        ...container,
        elementBonus,
        dayBonus,
        timeBonus,
        totalBonus,
        finalDropRate,
        recommendation: this.getContainerRecommendation(totalBonus)
      };
    }
    
    return containerAnalysis;
  }
  
  // 在类的末尾添加缺失的方法
  getContainerRecommendation(totalBonus) {
    if (totalBonus >= 1.3) return { level: '极佳', color: '#ffd700', advice: '强烈推荐！' };
    if (totalBonus >= 1.2) return { level: '很好', color: '#00ff00', advice: '推荐使用！' };
    if (totalBonus >= 1.1) return { level: '不错', color: '#00cc00', advice: '可以尝试！' };
    if (totalBonus >= 0.9) return { level: '一般', color: '#808080', advice: '普通运势！' };
    return { level: '不佳', color: '#ff6464', advice: '不建议使用！' };
  }
  
  getRecommendedContainers(operatorElement, date = new Date()) {
    const analysis = this.analyzeContainerFortune(operatorElement, date);
    if (!analysis) return [];
    
    return Object.entries(analysis)
      .sort(([,a], [,b]) => b.finalDropRate - a.finalDropRate)
      .slice(0, 3)
      .map(([name, data]) => ({
        name,
        dropRate: data.finalDropRate,
        bonus: data.totalBonus,
        recommendation: data.recommendation
      }));
  }
  
  getContainerAdvice(operatorElement, date = new Date()) {
    const analysis = this.analyzeContainerFortune(operatorElement, date);
    if (!analysis) return ['容器数据加载中...'];
    
    const advice = [];
    const topContainer = Object.entries(analysis)
      .sort(([,a], [,b]) => b.finalDropRate - a.finalDropRate)[0];
    
    if (topContainer && topContainer[1].totalBonus > 1.2) {
      advice.push(`今日最佳容器：${topContainer[0]}，出货率提升${((topContainer[1].finalDropRate - 1) * 100).toFixed(1)}%。`);
    }
    
    return advice;
  }
  
  calculateElement(birthday) {
    const date = new Date(birthday);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const elementIndex = (year + month) % 5;
    return this.elementCycle[elementIndex];
  }
  
  getDayElement(date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    return this.elementCycle[dayOfYear % 5];
  }
  
  calculateElementCompatibility(element1, element2) {
    if (this.elementGeneration[element1] === element2) {
      return 1.3;
    } else if (this.elementDestruction[element1] === element2) {
      return 0.7;
    } else if (element1 === element2) {
      return 1.1;
    } else {
      return 1.0;
    }
  }
  
  getCurrentTimeSlot(date = new Date()) {
    const hour = date.getHours();
    let timeIndex;
    
    if (hour >= 23 || hour < 1) timeIndex = 0;
    else timeIndex = Math.floor((hour + 1) / 2);
    
    return this.timeSlots[timeIndex];
  }
  
  getLunarDate(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const lunarOffset = Math.floor((year - 1900) * 12.368) + month - 1;
    const lunarMonth = (lunarOffset % 12) + 1;
    const lunarDay = ((day + lunarOffset) % 30) + 1;
    
    const lunarMonths = [
      '正月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '冬月', '腊月'
    ];
    
    return {
      year: year,
      month: lunarMonths[lunarMonth - 1],
      day: this.numberToChinese(lunarDay)
    };
  }
  
  numberToChinese(num) {
    const units = ['', '十', '二十', '三十'];
    const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    
    if (num <= 10) return digits[num] || '十';
    if (num < 20) return '十' + digits[num - 10];
    return units[Math.floor(num / 10)] + digits[num % 10];
  }
  
  getDetailedWealthAnalysis(operatorElement, date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const timeSlot = this.getCurrentTimeSlot(date);
    const wealthPos = this.calculateWealthPosition(operatorElement, date);
    const joyPos = this.calculateJoyGodPosition(date);
    
    return {
      wealth: {
        primary: wealthPos.primary,
        secondary: wealthPos.secondary,
        element: wealthPos.element,
        description: `今日${ganZhi.day}，${operatorElement}命干员财位在${wealthPos.primary}方。此方位五行属${wealthPos.element}，宜寻找${wealthPos.element}属性装备和容器。财位宜静不宜动，宜放置贵重物品，忌污秽杂乱。`,
        timeAdvice: `当前${timeSlot.name}(${timeSlot.range})，时辰五行属${timeSlot.element}，${this.getElementInteraction(timeSlot.element, wealthPos.element)}`
      },
      joy: {
        position: joyPos,
        description: `喜神方位在${joyPos}方，此方位行动多有贵人相助，宜在此方向进行重要决策和行动。喜神临门，万事如意，是今日最吉利的方位。`,
        timeBonus: this.calculateTimeBonus(timeSlot.element, joyPos)
      }
    };
  }
  
  getElementInteraction(timeElement, wealthElement) {
    if (this.elementGeneration[timeElement] === wealthElement) {
      return '时辰生财位，财运亨通，宜积极行动。';
    } else if (this.elementGeneration[wealthElement] === timeElement) {
      return '财位生时辰，需要付出努力，但收获可期。';
    } else if (this.elementDestruction[timeElement] === wealthElement) {
      return '时辰克财位，需谨慎理财，避免损失。';
    } else if (this.elementDestruction[wealthElement] === timeElement) {
      return '财位克时辰，财运较弱，宜保守行事。';
    }
    return '时辰与财位五行平和，按部就班即可。';
  }
  
  calculateTimeBonus(timeElement, direction) {
    return 1.1;
  }
  
  // 皮肤运势相关方法
  calculateSkinFortune(operatorElement, date = new Date()) {
    const ganZhi = this.calculateGanZhi(date);
    const dayElement = ganZhi.dayElement;
    const timeSlot = this.getCurrentTimeSlot(date);
    
    const characterFortune = this.calculateCharacterSkinFortune(operatorElement, dayElement, timeSlot);
    const weaponFortune = this.calculateWeaponSkinFortune(operatorElement, dayElement, timeSlot);
    const bestTime = this.calculateBestSkinTime(operatorElement, date);
    
    return {
      characterSkin: characterFortune,
      weaponSkin: weaponFortune,
      bestTime,
      dayElement,
      timeSlot: timeSlot.name,
      overallAdvice: this.getSkinOverallAdvice(characterFortune, weaponFortune)
    };
  }
  
  calculateCharacterSkinFortune(operatorElement, dayElement, timeSlot) {
    const system = this.skinDrawSystem.characterSkin;
    
    const operatorBonus = this.calculateElementCompatibility(operatorElement, system.element);
    const dayBonus = this.calculateElementCompatibility(dayElement, system.element);
    const timeBonus = this.calculateElementCompatibility(timeSlot.element, system.element);
    
    const totalBonus = (operatorBonus + dayBonus + timeBonus) / 3;
    const adjustedRedRate = Math.min(system.baseRedProbability * totalBonus, system.baseRedProbability * 2);
    
    const drawProbabilities = [];
    let cumulativeFailRate = 1;
    
    for (let i = 0; i < system.drawCosts.length - 1; i++) {
      const drawRate = adjustedRedRate * cumulativeFailRate;
      drawProbabilities.push({
        draw: i + 1,
        cost: system.drawCosts[i],
        probability: drawRate,
        cumulativeCost: system.drawCosts.slice(0, i + 1).reduce((a, b) => a + b, 0)
      });
      cumulativeFailRate *= (1 - adjustedRedRate);
    }
    
    drawProbabilities.push({
      draw: 8,
      cost: system.drawCosts[7],
      probability: cumulativeFailRate,
      cumulativeCost: system.drawCosts.reduce((a, b) => a + b, 0),
      guaranteed: true
    });
    
    const oneDrawLuck = adjustedRedRate;
    const beforeGuaranteed = 1 - cumulativeFailRate;
    
    return {
      type: 'character',
      name: system.name,
      baseRate: system.baseRedProbability,
      adjustedRate: adjustedRedRate,
      bonus: totalBonus,
      oneDrawLuck,
      beforeGuaranteed,
      drawProbabilities,
      recommendation: this.getCharacterSkinRecommendation(totalBonus, oneDrawLuck)
    };
  }
  
  calculateWeaponSkinFortune(operatorElement, dayElement, timeSlot) {
    const system = this.skinDrawSystem.weaponSkin;
    const qualityFortunes = {};
    
    for (const [quality, data] of Object.entries(system.qualities)) {
      const operatorBonus = this.calculateElementCompatibility(operatorElement, data.element);
      const dayBonus = this.calculateElementCompatibility(dayElement, data.element);
      const timeBonus = this.calculateElementCompatibility(timeSlot.element, data.element);
      
      const totalBonus = (operatorBonus + dayBonus + timeBonus) / 3;
      const adjustedRate = Math.min(data.probability * totalBonus, data.probability * 2);
      
      qualityFortunes[quality] = {
        ...data,
        bonus: totalBonus,
        adjustedRate,
        recommendation: this.getSkinRecommendation(totalBonus)
      };
    }
    
    const premiumSRate = qualityFortunes.S.adjustedRate * system.categories.premium.baseRate;
    const oneDrawPremiumS = premiumSRate;
    
    return {
      type: 'weapon',
      name: system.name,
      qualities: qualityFortunes,
      premiumSRate,
      oneDrawPremiumS,
      recommendation: this.getWeaponSkinRecommendation(oneDrawPremiumS)
    };
  }
  
  getCharacterSkinRecommendation(bonus, oneDrawLuck) {
    if (oneDrawLuck >= 0.25) return { level: '极佳', color: '#ff0000', advice: '一发入魂概率极高！' };
    if (oneDrawLuck >= 0.18) return { level: '很好', color: '#ff6b35', advice: '红皮概率大幅提升！' };
    if (bonus >= 1.2) return { level: '不错', color: '#ffd700', advice: '运势不错，可以尝试！' };
    return { level: '一般', color: '#95a5a6', advice: '建议等待更好时机！' };
  }
  
  getWeaponSkinRecommendation(premiumSRate) {
    if (premiumSRate >= 0.08) return { level: '极佳', color: '#ff6b35', advice: '极品S概率爆表！' };
    if (premiumSRate >= 0.05) return { level: '很好', color: '#9b59b6', advice: '极品S概率提升！' };
    if (premiumSRate >= 0.03) return { level: '不错', color: '#3498db', advice: '有机会出极品！' };
    return { level: '一般', color: '#95a5a6', advice: '平常心对待！' };
  }
  
  getSkinOverallAdvice(characterFortune, weaponFortune) {
    const advice = [];
    
    if (characterFortune.oneDrawLuck >= 0.2) {
      advice.push('🔥 人物红皮一发入魂概率很高，强烈推荐！');
    }
    
    if (weaponFortune.oneDrawPremiumS >= 0.06) {
      advice.push('⚡ 枪皮极品S概率提升，值得一试！');
    }
    
    if (characterFortune.beforeGuaranteed >= 0.8) {
      advice.push('💎 保底前出红皮概率很高！');
    }
    
    if (advice.length === 0) {
      advice.push('🌟 今日运势平稳，建议积累研究券等待更好时机！');
    }
    
    return advice;
  }
  
  getSkinRecommendation(bonus) {
    if (bonus >= 1.3) return '大吉';
    if (bonus >= 1.2) return '吉';
    if (bonus >= 1.1) return '小吉';
    if (bonus >= 0.9) return '平';
    return '不宜';
  }
  
  // 辅助方法：获取运势建议
  getRecommendation(bonus, danger) {
    if (bonus >= 1.3) return danger <= 3 ? '大吉' : '吉中带险';
    if (bonus >= 1.1) return danger <= 3 ? '小吉' : '平';
    if (bonus >= 0.9) return '平';
    return '凶';
  }
  
  calculateBestSkinTime(operatorElement, date) {
    const bestSlots = [];
    
    for (const slot of this.timeSlots) {
      const compatibility = this.calculateElementCompatibility(operatorElement, slot.element);
      if (compatibility >= 1.2) {
        bestSlots.push({
          name: slot.name,
          range: slot.range,
          bonus: compatibility
        });
      }
    }
    
    return bestSlots.length > 0 ? bestSlots : [{
      name: '当前时辰',
      range: '随时可抽',
      bonus: 1.0
    }];
  }
  
  // 增强版每日运势计算 - 整合所有功能
  calculateEnhancedDailyFortune(operatorCodename, analysisType = 'comprehensive', date = new Date()) {
    if (!this.operators || !this.maps || !this.containers) {
      console.error('数据尚未加载完成');
      return null;
    }
    
    const operator = this.operators.operators.find(op => op.codename === operatorCodename);
    if (!operator) {
      console.error('未找到指定干员:', operatorCodename);
      return null;
    }
    
    const operatorElement = operator.element;
    const ganZhi = this.calculateGanZhi(date);
    const dayElement = ganZhi.dayElement;
    const timeSlot = this.getCurrentTimeSlot(date);
    const compatibility = this.calculateElementCompatibility(dayElement, operatorElement);
    
    // 修复 calculateEnhancedDailyFortune 方法中的地图分析部分 (587-630行)
    // 基础地图分析 - 完全修复版本
    const mapAnalysis = {};
    const allZones = [];
    
    for (const [mapName, mapData] of Object.entries(this.maps.maps)) {
        mapAnalysis[mapName] = {};
        
        // 正确访问 bagua 数据结构
        if (mapData.bagua) {
            for (const [baguaName, zoneData] of Object.entries(mapData.bagua)) {
                const zoneCompatibility = this.calculateElementCompatibility(operatorElement, zoneData.element);
                const timeCompatibility = this.calculateElementCompatibility(timeSlot.element, zoneData.element);
                const finalBonus = zoneData.lootBonus * zoneCompatibility * compatibility * timeCompatibility;
                
                // 计算运势等级
                let fortuneLevel = '平';
                if (finalBonus >= 2.0) fortuneLevel = '极吉';
                else if (finalBonus >= 1.5) fortuneLevel = '大吉';
                else if (finalBonus >= 1.2) fortuneLevel = '吉';
                else if (finalBonus >= 0.8) fortuneLevel = '平';
                else if (finalBonus >= 0.6) fortuneLevel = '带险';
                else if (finalBonus >= 0.4) fortuneLevel = '凶';
                else if (finalBonus >= 0.2) fortuneLevel = '大凶';
                else fortuneLevel = '极险';
                
                const zoneResult = {
                    element: zoneData.element,
                    direction: zoneData.direction,
                    finalBonus: finalBonus,
                    danger: zoneData.danger,
                    meaning: zoneData.meaning,
                    fortune: fortuneLevel,
                    originalFortune: zoneData.fortune,
                    recommendation: this.getRecommendation(finalBonus, zoneData.danger),
                    bagua: baguaName,
                    lootBonus: zoneData.lootBonus
                };
                
                mapAnalysis[mapName][baguaName] = zoneResult;
                allZones.push({
                    map: mapName,
                    direction: baguaName,
                    ...zoneResult
                });
            }
        }
    }
    
    // 容器分析
    const containerAnalysis = this.analyzeContainerFortune(operatorElement, date);
    const recommendedContainers = this.getRecommendedContainers(containerAnalysis);
    
    // 皮肤运势分析
    const skinFortune = this.calculateSkinFortune(operatorElement, date);
    
    // 财位喜神分析
    const wealthAnalysis = this.getDetailedWealthAnalysis(operatorElement, date);
    
    // 奇门遁甲分析
    const qimenAnalysis = this.calculateQimenAnalysis(date);
    
    // 梅花易数分析
    const plumBlossomAnalysis = this.calculatePlumBlossomAnalysis(operatorCodename, date);
    
    // 找出最佳和最差区域
    const bestZones = allZones.sort((a, b) => b.finalBonus - a.finalBonus).slice(0, 3);
    const worstZones = allZones.sort((a, b) => a.finalBonus - b.finalBonus).slice(0, 3);
    
    // 生成每日建议
    const dailyAdvice = this.generateEnhancedDailyAdvice(operator, dayElement, compatibility, skinFortune, wealthAnalysis);
    
    // 根据分析类型返回特定分析
    let specificAnalysis = null;
    switch (analysisType) {
      case 'qimen':
        specificAnalysis = qimenAnalysis;
        break;
      case 'plum_blossom':
        specificAnalysis = plumBlossomAnalysis;
        break;
      case 'skin_fortune':
        specificAnalysis = skinFortune;
        break;
      case 'wealth_analysis':
        specificAnalysis = wealthAnalysis;
        break;
      default:
        specificAnalysis = {
          qimen: qimenAnalysis,
          plumBlossom: plumBlossomAnalysis,
          skinFortune: skinFortune,
          wealthAnalysis: wealthAnalysis
        };
    }
    
    return {
      operator: operator,
      date: date.toLocaleDateString('zh-CN'),
      ganZhi: ganZhi,
      dayElement: dayElement,
      timeSlot: timeSlot,
      overallLuck: compatibility,
      mapAnalysis: mapAnalysis,
      containerAnalysis: containerAnalysis,
      recommendedContainers: recommendedContainers,
      skinFortune: skinFortune,
      wealthAnalysis: wealthAnalysis,
      bestZones: bestZones,
      worstZones: worstZones,
      dailyAdvice: dailyAdvice,
      analysisType: analysisType,
      specificAnalysis: specificAnalysis
    };
  }
  
  // 修复 getRecommendedContainers 方法 - 添加重载版本
  getRecommendedContainers(containerAnalysis) {
    if (!containerAnalysis) return [];
    
    return Object.entries(containerAnalysis)
      .sort(([,a], [,b]) => b.finalDropRate - a.finalDropRate)
      .filter(([,data]) => data.totalBonus >= 1.0) // 只显示推荐的容器（totalBonus >= 1.0）
      .slice(0, 5) // 改为TOP 5
      .map(([name, data]) => ({ name, ...data }));
  }
  
  // 添加缺失的 generateEnhancedDailyAdvice 方法
  generateEnhancedDailyAdvice(operator, dayElement, compatibility, skinFortune, wealthAnalysis) {
    const advice = [];
    
    // 基础运势建议
    if (compatibility >= 1.2) {
      advice.push(`🌟 今日${dayElement}气旺盛，与${operator.codename}(${operator.element})相合，运势极佳！`);
    } else if (compatibility <= 0.8) {
      advice.push(`⚠️ 今日${dayElement}气与${operator.codename}(${operator.element})相冲，需谨慎行动。`);
    } else {
      advice.push(`📊 今日运势平稳，适合正常作战。`);
    }
    
    // 皮肤运势建议
    if (skinFortune && skinFortune.characterSkin.oneDrawLuck >= 0.2) {
      advice.push(`🎨 人物红皮运势极佳，一发入魂概率${(skinFortune.characterSkin.oneDrawLuck * 100).toFixed(1)}%！`);
    }
    
    if (skinFortune && skinFortune.weaponSkin.oneDrawPremiumS >= 0.06) {
      advice.push(`⚔️ 枪皮极品S运势提升，概率${(skinFortune.weaponSkin.oneDrawPremiumS * 100).toFixed(1)}%！`);
    }
    
    // 财位建议
    if (wealthAnalysis && wealthAnalysis.wealth) {
      // 检查干员与财位元素的相性
      const wealthCompatibility = this.calculateElementCompatibility(operator.element, wealthAnalysis.wealth.element);
      
      if (wealthCompatibility >= 1.1) {
        advice.push(`💰 今日财位在${wealthAnalysis.wealth.primary}方，宜寻找${wealthAnalysis.wealth.element}属性装备。`);
      } else if (wealthCompatibility <= 0.8) {
        // 如果相克，推荐相生的属性
        const beneficialElement = this.elementGeneration[operator.element]; // 干员生什么
        advice.push(`💰 今日财位在${wealthAnalysis.wealth.primary}方，但与干员属性相冲，建议寻找${beneficialElement}属性装备。`);
      } else {
        advice.push(`💰 今日财位在${wealthAnalysis.wealth.primary}方，财运平稳，按需选择装备即可。`);
      }
    }
    
    // 喜神建议
    if (wealthAnalysis && wealthAnalysis.joy) {
      advice.push(`🎭 喜神方位在${wealthAnalysis.joy.position}方，此方向行动多有贵人相助。`);
    }
    
    return advice;
  }
  
  // 每日核心提示模板库
  getDailyTipTemplates() {
    return {
      // 基础运势提示
      fortune: {
        excellent: [
          "今日五行相合，运势极佳，适合大胆行动！",
          "天时地利人和，今日是你的幸运日！",
          "星象吉利，今日行动必有收获！"
        ],
        good: [
          "今日运势不错，适合稳步推进计划。",
          "五行调和，今日行动多有助力。",
          "运势平稳上升，把握机会！"
        ],
        normal: [
          "今日运势平稳，保持常态即可。",
          "五行平衡，适合日常作战。",
          "运势中等，谨慎行事为佳。"
        ],
        poor: [
          "今日运势略有波折，需要谨慎应对。",
          "五行相冲，建议低调行事。",
          "运势欠佳，宜守不宜攻。"
        ],
        bad: [
          "今日运势不佳，建议避免重要行动。",
          "五行相克严重，需格外小心。",
          "运势低迷，宜静待时机。"
        ]
      },
      
      // 战术建议提示
      tactical: {
        wood: [
          "木气旺盛，适合快速突击和灵活机动。",
          "生机勃勃，团队配合将更加默契。",
          "木主生长，适合发展新战术。"
        ],
        fire: [
          "火气炽盛，攻击力大幅提升！",
          "热血沸腾，适合正面强攻。",
          "火主热情，团队士气高涨。"
        ],
        earth: [
          "土气厚重，防御力显著增强。",
          "稳如磐石，适合持久战。",
          "土主包容，适合团队协作。"
        ],
        metal: [
          "金气锐利，精准度大幅提升。",
          "锋芒毕露，适合精确打击。",
          "金主决断，适合快速决策。"
        ],
        water: [
          "水气流动，适合迂回战术。",
          "如水般灵活，变化莫测。",
          "水主智慧，策略制胜。"
        ]
      },
      
      // 装备建议提示
      equipment: {
        weapon: [
          "今日适合使用{weapon}，威力倍增！",
          "{weapon}与你今日气场相合，建议优先选择。",
          "五行加持下，{weapon}将发挥最佳效果。"
        ],
        armor: [
          "建议选择{element}属性防具，防护力更强。",
          "今日{element}气旺盛，相应装备效果更佳。",
          "{element}属性装备与你气场相合。"
        ]
      },
      
      // 时间建议提示
      timing: [
        "最佳行动时间：{timeSlot}({timeRange})",
        "{timeSlot}时分，{element}气最旺，行动最佳！",
        "建议在{timeSlot}进行重要任务，成功率更高。"
      ],
      
      // 方位建议提示
      direction: [
        "今日财位在{direction}方，该方向寻宝运佳！",
        "喜神方位：{direction}，此方向行动多有贵人相助。",
        "避开{badDirection}方，该方向今日不利。"
      ]
    };
  }

  // 生成个性化每日核心提示
  generateDailyCoreTips(operatorCodename, date = new Date()) {
    if (!this.operators) {
      console.error('数据尚未加载完成');
      return null;
    }
    
    const operator = this.operators.operators.find(op => op.codename === operatorCodename);
    if (!operator) {
      console.error('未找到指定干员:', operatorCodename);
      return null;
    }

    const templates = this.getDailyTipTemplates();
    const operatorElement = operator.element;
    const ganZhi = this.calculateGanZhi(date);
    const dayElement = ganZhi.dayElement;
    const timeSlot = this.getCurrentTimeSlot(date);
    const compatibility = this.calculateElementCompatibility(dayElement, operatorElement);
    const wealthAnalysis = this.getDetailedWealthAnalysis(operatorElement, date);
    const skinFortune = this.calculateSkinFortune(operatorElement, date);
    
    const tips = {
      date: date.toLocaleDateString('zh-CN'),
      operator: {
        codename: operator.codename,
        realname: operator.realname,
        element: operatorElement,
        position: operator.position || '未知',
        skills: operator.skills || {}
      },
      coreTips: []
    };

    // 1. 基础运势提示
    let fortuneLevel = 'normal';
    if (compatibility >= 1.5) fortuneLevel = 'excellent';
    else if (compatibility >= 1.2) fortuneLevel = 'good';
    else if (compatibility <= 0.6) fortuneLevel = 'bad';
    else if (compatibility <= 0.8) fortuneLevel = 'poor';
    
    const fortuneTip = this.getRandomTip(templates.fortune[fortuneLevel]);
    tips.coreTips.push({
      type: 'fortune',
      priority: 'high',
      content: fortuneTip,
      compatibility: compatibility
    });

    // 2. 基于干员技能的战术建议（如果有技能数据）
    if (operator.skills && operator.position) {
      const skillBasedTactical = this.generateSkillBasedTactical(operator, dayElement, compatibility);
      tips.coreTips.push({
        type: 'tactical',
        priority: 'high',
        content: skillBasedTactical,
        element: dayElement,
        skills: operator.skills
      });
    } else {
      // 回退到原有的战术建议
      const elementKey = this.getElementKey(dayElement);
      const tacticalTip = this.getRandomTip(templates.tactical[elementKey]);
      tips.coreTips.push({
        type: 'tactical',
        priority: 'medium',
        content: tacticalTip,
        element: dayElement
      });
    }

    // 3. 防具推荐（如果有防具系统数据）
    if (this.operators.armorSystem) {
      const armorRecommendation = this.generateArmorRecommendation(operator, dayElement, compatibility);
      tips.coreTips.push({
        type: 'armor',
        priority: 'high',
        content: armorRecommendation.content,
        recommendedLevel: armorRecommendation.level,
        armorType: armorRecommendation.type
      });
    }

    // 4. 子弹推荐（如果有子弹系统数据）
    if (this.operators.bulletSystem) {
      const bulletRecommendation = this.generateBulletRecommendation(operator, dayElement, compatibility);
      tips.coreTips.push({
        type: 'bullet',
        priority: 'high',
        content: bulletRecommendation.content,
        recommendedLevel: bulletRecommendation.level,
        penetration: bulletRecommendation.penetration
      });
    }

    // 5. 武器推荐（基于干员技能特点）
    if (operator.skills && operator.luckyWeapon) {
      const weaponRecommendation = this.generateWeaponRecommendation(operator, dayElement, compatibility);
      tips.coreTips.push({
        type: 'weapon',
        priority: 'medium',
        content: weaponRecommendation,
        luckyWeapon: operator.luckyWeapon
      });
    } else {
      // 回退到原有的装备建议
      const weaponTip = this.getRandomTip(templates.equipment.weapon)
        .replace('{weapon}', operator.luckyWeapon || '推荐武器');
      tips.coreTips.push({
        type: 'equipment',
        priority: 'medium',
        content: weaponTip,
        weapon: operator.luckyWeapon || '推荐武器'
      });
    }

    // 6. 最佳时间提示
    const bestTimeSlot = this.findBestTimeSlot(operatorElement, date);
    const timingTip = this.getRandomTip(templates.timing)
      .replace('{timeSlot}', bestTimeSlot.name)
      .replace('{timeRange}', bestTimeSlot.range)
      .replace('{element}', bestTimeSlot.element);
    tips.coreTips.push({
      type: 'timing',
      priority: 'high',
      content: timingTip,
      bestTime: bestTimeSlot
    });

    // 7. 方位建议提示
    if (wealthAnalysis && wealthAnalysis.wealth) {
      const directionTip = this.getRandomTip(templates.direction)
        .replace('{direction}', wealthAnalysis.wealth.primary)
        .replace('{badDirection}', this.getOppositeDirection(wealthAnalysis.wealth.primary));
      tips.coreTips.push({
        type: 'direction',
        priority: 'medium',
        content: directionTip,
        wealthDirection: wealthAnalysis.wealth.primary
      });
    }

    // 8. 特殊事件提示（基于皮肤运势）
    if (skinFortune) {
      if (skinFortune.characterSkin.oneDrawLuck >= 0.15) {
        tips.coreTips.push({
          type: 'special',
          priority: 'high',
          content: `🎨 今日人物红皮运势极佳！一发入魂概率高达${(skinFortune.characterSkin.oneDrawLuck * 100).toFixed(1)}%，建议尝试抽取！`,
          skinLuck: skinFortune.characterSkin.oneDrawLuck
        });
      }
      
      if (skinFortune.weaponSkin.oneDrawPremiumS >= 0.05) {
        tips.coreTips.push({
          type: 'special',
          priority: 'high',
          content: `⚔️ 今日枪皮极品S运势提升！概率达到${(skinFortune.weaponSkin.oneDrawPremiumS * 100).toFixed(1)}%，机不可失！`,
          weaponLuck: skinFortune.weaponSkin.oneDrawPremiumS
        });
      }
    }

    // 9. 每日格言（基于五行哲学）
    const dailyMotto = this.generateDailyMotto(operatorElement, dayElement, compatibility);
    tips.coreTips.push({
      type: 'motto',
      priority: 'low',
      content: dailyMotto,
      philosophy: true
    });
    
    return tips;
  }

  // 新增：基于干员技能生成战术建议
  generateSkillBasedTactical(operator, dayElement, compatibility) {
    const skills = operator.skills;
    const position = operator.position;
    let tacticalAdvice = [];
    
    // 基于位置和技能生成独特的战术建议
    switch(position) {
      case '突击位':
        if (compatibility >= 1.2) {
          tacticalAdvice.push(`⚡ 今日${dayElement}气增强突击效果，`);
          if (skills.primary.name.includes('外骨骼')) {
            tacticalAdvice.push('机动性大幅提升，适合快速突破！');
          } else if (skills.primary.name.includes('虎蹲炮')) {
            tacticalAdvice.push('重火力威力增强，适合正面强攻！');
          }
        } else {
          tacticalAdvice.push(`🛡️ 今日突击效果一般，建议采用稳健战术。`);
        }
        break;
        
      case '支援位':
        if (compatibility >= 1.2) {
          tacticalAdvice.push(`💚 今日${dayElement}气增强支援效果，`);
          if (skills.primary.name.includes('激素枪')) {
            tacticalAdvice.push('团队治疗效果显著提升！');
          } else if (skills.primary.name.includes('集群系统')) {
            tacticalAdvice.push('团队增益效果大幅增强！');
          }
        } else {
          tacticalAdvice.push(`🔄 今日支援效果平稳，专注团队配合。`);
        }
        break;
        
      case '工程位':
        if (compatibility >= 1.2) {
          tacticalAdvice.push(`🔧 今日${dayElement}气强化工程技能，`);
          if (skills.primary.name.includes('声波')) {
            tacticalAdvice.push('控场能力大幅提升！');
          } else if (skills.primary.name.includes('防爆')) {
            tacticalAdvice.push('防护和拆除能力增强！');
          }
        } else {
          tacticalAdvice.push(`🛠️ 今日工程效果稳定，谨慎部署设备。`);
        }
        break;
        
      case '侦查位':
        if (compatibility >= 1.2) {
          tacticalAdvice.push(`👁️ 今日${dayElement}气提升侦察精度，`);
          if (skills.primary.name.includes('箭矢')) {
            tacticalAdvice.push('远程侦察和标记效果极佳！');
          } else if (skills.primary.name.includes('破译器')) {
            tacticalAdvice.push('电子侦察能力显著增强！');
          }
        } else {
          tacticalAdvice.push(`🔍 今日侦察效果平稳，保持警戒。`);
        }
        break;
    }
    
    return tacticalAdvice.join('');
  }

  // 新增：生成防具推荐
  generateArmorRecommendation(operator, dayElement, compatibility) {
    // 添加安全检查
    if (!this.operators || !this.operators.armorSystem || !this.operators.armorSystem.levels) {
      return {
        level: 3,
        type: '防御防护',
        content: `🛡️ 推荐使用3级蓝色防具(防御防护)，今日${dayElement}气加持下防护效果${compatibility >= 1.2 ? '显著增强' : compatibility <= 0.8 ? '略有下降' : '正常'}！`
      };
    }
    
    const armorSystem = this.operators.armorSystem;
    let recommendedLevel = 3; // 默认蓝色防具
    let armorType = '防御防护';
    
    // 基于五行相性调整推荐等级
    if (compatibility >= 1.3) {
      recommendedLevel = 5; // 金色防具
    } else if (compatibility >= 1.1) {
      recommendedLevel = 4; // 紫色防具
    } else if (compatibility <= 0.8) {
      recommendedLevel = 2; // 绿色防具（保守选择）
    }
    
    // 基于干员定位调整防具类型
    if (operator.position === '侦查位') {
      armorType = '听力防护';
    }
    
    const armorInfo = armorSystem.levels.find(level => level.level === recommendedLevel);
    
    return {
      level: recommendedLevel,
      type: armorType,
      content: `🛡️ 推荐使用${armorInfo.level}级${armorInfo.color}防具(${armorType})，今日${dayElement}气加持下防护效果${compatibility >= 1.2 ? '显著增强' : compatibility <= 0.8 ? '略有下降' : '正常'}！`
    };
  }

  // 新增：生成子弹推荐
  generateBulletRecommendation(operator, dayElement, compatibility) {
    // 添加安全检查
    if (!this.operators || !this.operators.bulletSystem || !this.operators.bulletSystem.levels) {
      return {
        level: 3,
        penetration: '中等穿透',
        content: `🔫 推荐使用3级蓝色子弹，中等穿透能力在今日${dayElement}气加持下${compatibility >= 1.2 ? '大幅提升' : compatibility <= 0.8 ? '略有减弱' : '保持稳定'}！`
      };
    }
    
    const bulletSystem = this.operators.bulletSystem;
    let recommendedLevel = 3; // 默认蓝色子弹
    
    // 基于五行相性和干员定位调整推荐等级
    if (compatibility >= 1.3) {
      recommendedLevel = 5; // 金色子弹
    } else if (compatibility >= 1.1) {
      recommendedLevel = 4; // 紫色子弹
    } else if (compatibility <= 0.8) {
      recommendedLevel = 2; // 绿色子弹
    }
    
    // 突击位干员在高相性时推荐更高级子弹
    if (operator.position === '突击位' && compatibility >= 1.2) {
      recommendedLevel = Math.min(5, recommendedLevel + 1);
    }
    
    const bulletInfo = bulletSystem.levels.find(level => level.level === recommendedLevel);
    
    return {
      level: recommendedLevel,
      penetration: bulletInfo.penetration,
      content: `🔫 推荐使用${bulletInfo.level}级${bulletInfo.color}子弹，${bulletInfo.penetration}能力在今日${dayElement}气加持下${compatibility >= 1.2 ? '大幅提升' : compatibility <= 0.8 ? '略有减弱' : '保持稳定'}！`
    };
  }

  // 新增：基于干员技能生成武器推荐
  generateWeaponRecommendation(operator, dayElement, compatibility) {
    // 定义真正的枪械武器列表
    const weaponCategories = {
      '突击位': ['突击步枪', 'AK系列', 'M4系列', '自动步枪'],
      '支援位': ['轻机枪', '狙击步枪', '精确射手步枪', '半自动步枪'],
      '工程位': ['霰弹枪', '冲锋枪', '近战武器', '防御型步枪'],
      '侦查位': ['狙击步枪', '消音步枪', '轻型突击步枪', '精确射手步枪']
    };
    
    const position = operator.position;
    const availableWeapons = weaponCategories[position] || ['突击步枪', '冲锋枪'];
    
    // 基于五行相性选择推荐武器
    let recommendedWeapon;
    if (compatibility >= 1.3) {
      recommendedWeapon = availableWeapons[0]; // 最佳武器
    } else if (compatibility >= 1.1) {
      recommendedWeapon = availableWeapons[1] || availableWeapons[0];
    } else {
      recommendedWeapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
    }
    
    let weaponAdvice = `🎯 今日推荐使用${recommendedWeapon}，`;
    
    // 基于干员位置给出战术建议
    switch(position) {
      case '突击位':
        weaponAdvice += compatibility >= 1.2 ? 
          '高机动作战效果显著，适合主动进攻！' : 
          '保持中等距离作战，注意掩护队友！';
        break;
      case '支援位':
        weaponAdvice += '保持后排位置，为队友提供火力支援和治疗！';
        break;
      case '工程位':
        weaponAdvice += '利用地形优势，配合技能进行区域控制！';
        break;
      case '侦查位':
        weaponAdvice += '保持隐蔽，优先收集情报和远程支援！';
        break;
      default:
        weaponAdvice += `在今日${dayElement}气加持下威力${compatibility >= 1.2 ? '显著增强' : '保持稳定'}！`;
    }
    
    return weaponAdvice;
  }

  // 辅助方法
  getRandomTip(tipArray) {
    return tipArray[Math.floor(Math.random() * tipArray.length)];
  }

  getElementKey(element) {
    const elementMap = {
      '木': 'wood',
      '火': 'fire', 
      '土': 'earth',
      '金': 'metal',
      '水': 'water'
    };
    return elementMap[element] || 'earth';
  }

  findBestTimeSlot(operatorElement, date) {
    let bestSlot = this.timeSlots[0];
    let bestCompatibility = 0;
    
    for (const slot of this.timeSlots) {
      const compatibility = this.calculateElementCompatibility(operatorElement, slot.element);
      if (compatibility > bestCompatibility) {
        bestCompatibility = compatibility;
        bestSlot = slot;
      }
    }
    
    return bestSlot;
  }

  getOppositeDirection(direction) {
    const opposites = {
      '东': '西', '西': '东',
      '南': '北', '北': '南',
      '东南': '西北', '西北': '东南',
      '东北': '西南', '西南': '东北'
    };
    return opposites[direction] || '未知';
  }

  generateDailyMotto(operatorElement, dayElement, compatibility) {
    const mottos = {
      high: [
        "五行相合，万事皆宜。顺势而为，必有所成。",
        "天时地利人和，今日正是展现实力之时。",
        "气运相通，心想事成。把握机会，勇往直前。"
      ],
      medium: [
        "平和致远，稳中求进。保持初心，终有收获。",
        "五行调和，心境平静。专注当下，自然成功。",
        "不急不躁，步步为营。积小胜为大胜。"
      ],
      low: [
        "逆境磨练意志，困难铸就成长。坚持不懈，终见光明。",
        "山重水复疑无路，柳暗花明又一村。耐心等待，机会自来。",
        "宝剑锋从磨砺出，梅花香自苦寒来。今日之难，明日之财。"
      ]
    };
    
    let level = 'medium';
    if (compatibility >= 1.2) level = 'high';
    else if (compatibility <= 0.8) level = 'low';
    
    return this.getRandomTip(mottos[level]);
  }
} // EnhancedDeltaFortuneEngine 类结束

// 个性化学习系统
class PersonalizationEngine {
  constructor() {
    this.userPreferences = this.loadUserPreferences();
    this.behaviorHistory = this.loadBehaviorHistory();
  }
  
  // 记录用户行为
  recordUserBehavior(operatorCodename, tipType, action, result) {
    const behavior = {
      timestamp: Date.now(),
      operator: operatorCodename,
      tipType: tipType,
      action: action, // 'followed', 'ignored', 'shared'
      result: result  // 'success', 'failure', 'neutral'
    };
    
    this.behaviorHistory.push(behavior);
    this.saveBehaviorHistory();
    this.updatePreferences();
  }
  
  // 更新用户偏好
  updatePreferences() {
    const preferences = {};
    
    // 分析用户最喜欢的提示类型
    const tipTypeStats = {};
    this.behaviorHistory.forEach(behavior => {
      if (!tipTypeStats[behavior.tipType]) {
        tipTypeStats[behavior.tipType] = { followed: 0, total: 0 };
      }
      tipTypeStats[behavior.tipType].total++;
      if (behavior.action === 'followed') {
        tipTypeStats[behavior.tipType].followed++;
      }
    });
    
    // 计算偏好权重
    for (const [tipType, stats] of Object.entries(tipTypeStats)) {
      preferences[tipType] = stats.total > 0 ? stats.followed / stats.total : 0.5;
    }
    
    this.userPreferences = preferences;
    this.saveUserPreferences();
  }
  
  // 根据偏好调整提示权重
  adjustTipPriority(tips) {
    return tips.map(tip => {
      const preference = this.userPreferences[tip.type] || 0.5;
      const adjustedPriority = this.calculateAdjustedPriority(tip.priority, preference);
      
      return {
        ...tip,
        originalPriority: tip.priority,
        priority: adjustedPriority,
        personalizedScore: preference
      };
    });
  }
  
  calculateAdjustedPriority(originalPriority, preference) {
    const priorityValues = { 'low': 1, 'medium': 2, 'high': 3 };
    const priorityNames = ['low', 'medium', 'high'];
    
    let value = priorityValues[originalPriority] || 2;
    
    // 根据用户偏好调整
    if (preference > 0.7) {
      value = Math.min(3, value + 1);
    } else if (preference < 0.3) {
      value = Math.max(1, value - 1);
    }
    
    return priorityNames[value - 1];
  }
  
  // 本地存储管理
  loadUserPreferences() {
    try {
      const stored = localStorage.getItem('delta_user_preferences');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }
  
  saveUserPreferences() {
    localStorage.setItem('delta_user_preferences', JSON.stringify(this.userPreferences));
  }
  
  loadBehaviorHistory() {
    try {
      const stored = localStorage.getItem('delta_behavior_history');
      const history = stored ? JSON.parse(stored) : [];
      
      // 只保留最近30天的记录
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      return history.filter(behavior => behavior.timestamp > thirtyDaysAgo);
    } catch {
      return [];
    }
  }
  
  saveBehaviorHistory() {
    localStorage.setItem('delta_behavior_history', JSON.stringify(this.behaviorHistory));
  }
}

// 每日提示缓存和更新管理
class DailyTipsManager {
  constructor(fortuneEngine) {
    this.fortuneEngine = fortuneEngine;
    this.cache = new Map();
    this.lastUpdateDate = null;
    this.updateCallbacks = [];
  }
  
  // 检查是否需要更新
  needsUpdate(date = new Date()) {
    const today = date.toDateString();
    return this.lastUpdateDate !== today;
  }
  
  // 获取或生成每日提示
  async getDailyTips(operatorCodename, date = new Date()) {
    console.log('=== getDailyTips 开始 ===');
    console.log('干员代号:', operatorCodename);
    console.log('日期:', date);
    
    const today = date.toDateString();
    const cacheKey = `${operatorCodename}_${today}`;
    console.log('缓存键:', cacheKey);
    
    // 检查缓存
    if (this.cache.has(cacheKey) && !this.needsUpdate(date)) {
      console.log('使用缓存数据');
      return this.cache.get(cacheKey);
    }
    
    console.log('开始生成新的提示...');
    console.log('fortuneEngine 状态:', this.fortuneEngine);
    console.log('fortuneEngine.operators:', this.fortuneEngine.operators);
    
    try {
      // 生成新的提示
      const tips = this.fortuneEngine.generateDailyCoreTips(operatorCodename, date);
      console.log('generateDailyCoreTips 返回:', tips);
      
      if (tips) {
        this.cache.set(cacheKey, tips);
        this.lastUpdateDate = today;
        console.log('提示已缓存，触发更新回调');
        
        // 触发更新回调
        this.notifyUpdate(tips);
      } else {
        console.error('generateDailyCoreTips 返回了空值');
      }
      
      console.log('=== getDailyTips 结束 ===');
      return tips;
    } catch (error) {
      console.error('生成提示时出错:', error);
      console.error('错误堆栈:', error.stack);
      throw error;
    }
  }
  
  // 预生成所有干员的提示
  async preGenerateAllTips(date = new Date()) {
    if (!this.fortuneEngine.operators) {
      console.error('干员数据未加载');
      return;
    }
    
    const allTips = {};
    const operators = this.fortuneEngine.operators.operators;
    
    for (const operator of operators) {
      const tips = await this.getDailyTips(operator.codename, date);
      if (tips) {
        allTips[operator.codename] = tips;
      }
    }
    
    return allTips;
  }
  
  // 清理过期缓存
  cleanExpiredCache() {
    const today = new Date().toDateString();
    for (const [key, value] of this.cache.entries()) {
      if (!key.includes(today)) {
        this.cache.delete(key);
      }
    }
  }
  
  // 注册更新回调
  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }
  
  // 通知更新
  notifyUpdate(tips) {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(tips);
      } catch (error) {
        console.error('更新回调执行失败:', error);
      }
    });
  }
  
  // 定时更新任务
  startAutoUpdate() {
    // 每小时检查一次是否需要更新
    setInterval(() => {
      if (this.needsUpdate()) {
        this.cleanExpiredCache();
        console.log('开始每日提示更新...');
      }
    }, 60 * 60 * 1000); // 1小时
    
    // 每天凌晨0:01自动更新
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 1, 0, 0);
    
    const timeUntilUpdate = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.preGenerateAllTips();
      
      // 设置每日定时更新
      setInterval(() => {
        this.preGenerateAllTips();
      }, 24 * 60 * 60 * 1000); // 24小时
    }, timeUntilUpdate);
  }
}