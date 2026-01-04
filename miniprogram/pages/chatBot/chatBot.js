const ROOT_TYPES = ['金灵根', '木灵根', '水灵根', '火灵根', '土灵根', '混沌灵根'];
const DAO_NAMES = ['青玄', '望舒', '凌霄', '北冥', '慕白', '星渊', '临川', '浮黎', '沐风', '明河'];
const SECT_NAMES = ['天剑宗', '太虚宫', '焚月谷', '无量观', '玄霄门', '青冥宗'];
const LOCATION_NAMES = ['落星渊', '幽陵洲', '离火荒原', '昆仑废墟', '暮雪关', '千魇谷'];
const DANGER_ZONES = ['万鬼海', '裂天墟', '玄冥遗城', '血骨森林', '归墟禁地'];
const PARTNER_NAMES = ['月瑶', '辞霜', '顾蘅', '沈夜', '湛清', '燕回', '北鹤'];
const ENEMY_TITLES = ['剑修', '护法', '长老', '真传弟子', '暗卫'];
const SECT_RANKS = [
  { minRealm: 0, title: '外门记名弟子' },
  { minRealm: 1, title: '外门弟子' },
  { minRealm: 2, title: '内门弟子' },
  { minRealm: 3, title: '亲传弟子' },
  { minRealm: 4, title: '执事堂主' },
  { minRealm: 5, title: '真传长老' },
  { minRealm: 6, title: '护法长老' },
  { minRealm: 7, title: '太上长老' },
  { minRealm: 8, title: '掌门' },
  { minRealm: 9, title: '一方霸主' }
];
const REALM_STAGES = [
  { name: '炼气', lifespanBonus: 60, difficulty: 0.65, motto: '灵气入体，周天初转' },
  { name: '筑基', lifespanBonus: 80, difficulty: 0.55, motto: '巩固道基，气海自生' },
  { name: '金丹', lifespanBonus: 120, difficulty: 0.45, motto: '金丹一转，百邪不侵' },
  { name: '元婴', lifespanBonus: 160, difficulty: 0.35, motto: '神魂出窍，捉星拿月' },
  { name: '化神', lifespanBonus: 220, difficulty: 0.3, motto: '衍化神念，万物皆明' },
  { name: '炼虚', lifespanBonus: 260, difficulty: 0.25, motto: '破碎虚空，真我初成' },
  { name: '合体', lifespanBonus: 320, difficulty: 0.2, motto: '天地同体，万法归一' },
  { name: '大乘', lifespanBonus: 400, difficulty: 0.15, motto: '道果圆满，万法随心' },
  { name: '渡劫', lifespanBonus: 500, difficulty: 0.1, motto: '雷火淬体，逆天改命' },
  { name: '飞升', lifespanBonus: 999, difficulty: 0.05, motto: '破碎仙凡，直指九天' }
];

const OPPORTUNITIES = [
  { title: '灵气潮汐', desc: '天地灵气翻滚，你趁势参悟。', effect: 'progress', min: 15, max: 28 },
  { title: '上古遗迹', desc: '拾得断裂古简，记载秘术。', effect: 'resource', min: 35, max: 65 },
  { title: '妖兽伏袭', desc: '险遭妖兽伏击，身负轻伤。', effect: 'injury', min: 8, max: 18 },
  { title: '紫府悟道', desc: '心神澄澈，顿悟经文。', effect: 'attribute', attr: 'comprehension', min: 4, max: 9 },
  { title: '灵脉温养', desc: '灵脉冲刷骨骼，体魄更胜。', effect: 'attribute', attr: 'physique', min: 3, max: 6 },
  { title: '鸿蒙紫气', desc: '紫气盘旋，气运随之暴涨。', effect: 'luck', min: 5, max: 10 },
  { title: '道侣扶持', desc: '有人护持道法，寿元稍增。', effect: 'lifespan', min: 12, max: 24 },
  { title: '心魔侵蚀', desc: '心魔趁虚而入，修为有损。', effect: 'setback', min: 12, max: 25 }
];

const INCIDENT_CHANCE = {
  meditate: 0.12,
  adventure: 0.22,
  elixir: 0.1,
  years: 0.14,
  craft: 0.12,
  breakthrough: 0.6,
  incident: 0,
  general: 0.12
};

const BATTLE_OPENERS = [
  '霜风卷起剑鸣，煞气逼人',
  '灵泉倒灌，雷光缠绕在石壁',
  '星火洒落，山河间回响战鼓',
  '青云压顶，寒江怒吼',
  '荒沙翻涌，剑罡裂空'
];

const SIEGE_SCENES = [
  '阵旗密布，灵禽环绕峰顶',
  '雷火轰鸣，把洞府周遭烧得通红',
  '玄铁战车碾过灵田',
  '夜雨如注，杀气成河',
  '妖雾弥漫，法器轰鸣'
];

const INVITATION_MOTIVES = [
  '寻得古帝留下的星火神骨',
  '据说能挖出太初雷种',
  '或许藏有太虚真龙的逆鳞',
  '想要分一杯远古仙泉',
  '盼能找回失落的仙舟'
];

const pickFrom = (list) => list[Math.floor(Math.random() * list.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (num, min, max) => Math.max(min, Math.min(num, max));
const app = getApp();

Page({
  data: {
    cultivator: null,
    eventLog: [],
    gameOver: false,
    currentRealm: null,
    nextRealm: null,
    lifespanCeiling: 0,
    lifespanRemaining: 0
  },
  incidentLock: false,
  lastIncidentAt: 0,

  onLoad() {
    const saved = app?.getCultivatorProfile ? app.getCultivatorProfile() : wx.getStorageSync('cultivatorProfile');
    if (saved && saved.name) {
      const eventLog = saved.eventLog || [];
      this.refreshState(saved, eventLog, false);
    } else {
      this.startNewJourney();
    }
  },

  startNewJourney() {
    const cultivator = this.createCultivator();
    const eventLog = [];
    this.appendLog(eventLog, `${cultivator.name}踏入灵州，觉醒${cultivator.rootType}，立誓求道。`);
    this.refreshState(cultivator, eventLog, true);
  },

  createCultivator() {
    const rootType = pickFrom(ROOT_TYPES);
    const daoName = `${pickFrom(DAO_NAMES)}·${rootType[0]}`;
    const age = randomBetween(16, 23);
    return {
      id: Date.now(),
      name: daoName,
      rootType,
      realmIndex: 0,
      progress: 0,
      age,
      attributes: {
        comprehension: randomBetween(55, 85),
        physique: randomBetween(50, 80),
        luck: randomBetween(45, 90),
        sense: randomBetween(48, 85)
      },
      resources: {
        spiritStones: randomBetween(40, 70),
        elixirs: 1
      },
      stats: {
        baseAttack: randomBetween(32, 46),
        baseDefense: randomBetween(24, 38),
        baseHp: randomBetween(140, 190),
        baseMana: randomBetween(90, 140),
        attack: 0,
        defense: 0,
        maxHp: 0,
        maxMana: 0,
        currentHp: 0,
        currentMana: 0,
        speed: 0,
        hpPercent: 100,
        manaPercent: 100
      },
      sectRank: '外门记名弟子',
      fame: 0,
      partnerName: pickFrom(PARTNER_NAMES)
    };
  },

  refreshState(cultivator, eventLog, shouldPersist = true) {
    this.hydrateLegacyProfile(cultivator);
    this.recalculateCombatProfile(cultivator);
    this.assignSectRank(cultivator);
    const derived = this.getDerivedStats(cultivator);
    this.setData({
      cultivator,
      eventLog,
      currentRealm: derived.currentRealm,
      nextRealm: derived.nextRealm,
      lifespanCeiling: derived.lifespanCeiling,
      lifespanRemaining: derived.lifespanRemaining,
      gameOver: derived.hasAscended || derived.hasFallen
    });

    if (shouldPersist) {
      const payload = {
        ...cultivator,
        eventLog,
        currentRealm: derived.currentRealm.name,
        lifespanCeiling: derived.lifespanCeiling,
        stats: cultivator.stats,
        attributes: cultivator.attributes,
        sectRank: cultivator.sectRank
      };
      if (app?.saveCultivatorProfile) {
        app.saveCultivatorProfile(payload);
      } else {
        wx.setStorageSync('cultivatorProfile', payload);
      }
    }
  },

  hydrateLegacyProfile(cultivator) {
    cultivator.attributes = cultivator.attributes || {};
    cultivator.attributes.comprehension = cultivator.attributes.comprehension ?? randomBetween(55, 80);
    cultivator.attributes.physique = cultivator.attributes.physique ?? randomBetween(50, 75);
    cultivator.attributes.luck = cultivator.attributes.luck ?? randomBetween(45, 80);
    cultivator.attributes.sense = cultivator.attributes.sense ?? randomBetween(48, 85);
    cultivator.stats = cultivator.stats || {
      baseAttack: randomBetween(32, 46),
      baseDefense: randomBetween(24, 38),
      baseHp: randomBetween(140, 190),
      baseMana: randomBetween(90, 140)
    };
    ['baseAttack', 'baseDefense', 'baseHp', 'baseMana'].forEach((key) => {
      if (typeof cultivator.stats[key] !== 'number') {
        cultivator.stats[key] = key.includes('Hp') ? 150 : 35;
      }
    });
    cultivator.stats.attack = cultivator.stats.attack || 0;
    cultivator.stats.defense = cultivator.stats.defense || 0;
    cultivator.stats.maxHp = cultivator.stats.maxHp || cultivator.stats.baseHp;
    cultivator.stats.maxMana = cultivator.stats.maxMana || cultivator.stats.baseMana;
    cultivator.stats.currentHp = cultivator.stats.currentHp ?? cultivator.stats.maxHp;
    cultivator.stats.currentMana = cultivator.stats.currentMana ?? cultivator.stats.maxMana;
    cultivator.stats.speed = cultivator.stats.speed || 0;
    cultivator.stats.hpPercent = cultivator.stats.hpPercent ?? 100;
    cultivator.stats.manaPercent = cultivator.stats.manaPercent ?? 100;
    cultivator.sectRank = cultivator.sectRank || '外门记名弟子';
    cultivator.resources = cultivator.resources || { spiritStones: 20, elixirs: 0 };
    this.updateStatPercentages(cultivator);
  },

  recalculateCombatProfile(cultivator) {
    if (!cultivator.stats) return;
    const ratioHp = cultivator.stats.maxHp
      ? (cultivator.stats.currentHp ?? cultivator.stats.maxHp) / cultivator.stats.maxHp
      : 1;
    const ratioMana = cultivator.stats.maxMana
      ? (cultivator.stats.currentMana ?? cultivator.stats.maxMana) / cultivator.stats.maxMana
      : 1;
    const realmMultiplier = 1 + cultivator.realmIndex * 0.28;
    const agilityFactor = 1 + cultivator.attributes.comprehension / 220;
    const physiqueFactor = 1 + cultivator.attributes.physique / 240;

    cultivator.stats.attack = Math.round((cultivator.stats.baseAttack + cultivator.attributes.comprehension * 0.25) * realmMultiplier);
    cultivator.stats.defense = Math.round((cultivator.stats.baseDefense + cultivator.attributes.physique * 0.25) * realmMultiplier);
    cultivator.stats.maxHp = Math.max(1, Math.round((cultivator.stats.baseHp + cultivator.attributes.physique * 2.4) * realmMultiplier));
    cultivator.stats.maxMana = Math.max(
      1,
      Math.round((cultivator.stats.baseMana + cultivator.attributes.comprehension * 1.6 + cultivator.attributes.sense * 1.1) * agilityFactor)
    );
    cultivator.stats.currentHp = clamp(Math.round(cultivator.stats.maxHp * ratioHp), 0, cultivator.stats.maxHp);
    cultivator.stats.currentMana = clamp(Math.round(cultivator.stats.maxMana * ratioMana), 0, cultivator.stats.maxMana);
    cultivator.stats.speed = Math.round((cultivator.stats.attack + cultivator.stats.defense) * 0.1 * physiqueFactor);
    this.updateStatPercentages(cultivator);
  },

  assignSectRank(cultivator) {
    const rank = [...SECT_RANKS].reverse().find((item) => cultivator.realmIndex >= item.minRealm);
    cultivator.sectRank = rank ? rank.title : '外门记名弟子';
  },

  updateStatPercentages(cultivator) {
    if (!cultivator.stats) return;
    const hpPercent = cultivator.stats.maxHp > 0
      ? Math.round(((cultivator.stats.currentHp ?? cultivator.stats.maxHp) / cultivator.stats.maxHp) * 100)
      : 0;
    const manaPercent = cultivator.stats.maxMana > 0
      ? Math.round(((cultivator.stats.currentMana ?? cultivator.stats.maxMana) / cultivator.stats.maxMana) * 100)
      : 0;
    cultivator.stats.hpPercent = clamp(hpPercent, 0, 100);
    cultivator.stats.manaPercent = clamp(manaPercent, 0, 100);
  },

  getDerivedStats(cultivator) {
    const currentRealm = REALM_STAGES[cultivator.realmIndex] || REALM_STAGES[REALM_STAGES.length - 1];
    const nextRealm = REALM_STAGES[cultivator.realmIndex + 1] || null;
    const lifespanCeiling = this.calculateLifespan(cultivator);
    const lifespanRemaining = Math.max(0, Math.round(lifespanCeiling - cultivator.age));
    return {
      currentRealm,
      nextRealm,
      lifespanCeiling,
      lifespanRemaining,
      hasAscended: currentRealm.name === '飞升',
      hasFallen: lifespanRemaining <= 0
    };
  },

  calculateLifespan(cultivator) {
    const base = 60;
    const realmBonus = REALM_STAGES.slice(0, cultivator.realmIndex + 1).reduce((sum, stage) => sum + stage.lifespanBonus, 0);
    const physiqueBonus = cultivator.attributes.physique * 1.2;
    return Math.round(base + realmBonus + physiqueBonus);
  },

  appendLog(list, message) {
    const date = new Date();
    const label = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    list.unshift(`${label} · ${message}`);
    if (list.length > 35) {
      list.pop();
    }
  },

  cloneCultivator() {
    return JSON.parse(JSON.stringify(this.data.cultivator));
  },

  cloneLog() {
    return this.data.eventLog ? [...this.data.eventLog] : [];
  },

  ensureAlive() {
    if (!this.data.cultivator) return false;
    if (this.data.gameOver) {
      wx.showToast({ title: '本次修行已终结', icon: 'none' });
      return false;
    }
    return true;
  },

  consumeTime(cultivator, years = 1) {
    cultivator.age += years;
    return cultivator;
  },

  changeHp(cultivator, delta) {
    if (!cultivator.stats) return;
    cultivator.stats.currentHp = clamp(
      (cultivator.stats.currentHp ?? cultivator.stats.maxHp) + delta,
      0,
      cultivator.stats.maxHp
    );
    this.updateStatPercentages(cultivator);
  },

  changeMana(cultivator, delta) {
    if (!cultivator.stats) return;
    cultivator.stats.currentMana = clamp(
      (cultivator.stats.currentMana ?? cultivator.stats.maxMana) + delta,
      0,
      cultivator.stats.maxMana
    );
    this.updateStatPercentages(cultivator);
  },

  meditate() {
    if (!this.ensureAlive()) return;
    const cultivator = this.cloneCultivator();
    const logs = this.cloneLog();

    const bonus = cultivator.attributes.comprehension / 110;
    const gain = Math.round(randomBetween(12, 20) * (1 + bonus));
    cultivator.progress = clamp(cultivator.progress + gain, 0, 120);
    this.consumeTime(cultivator, 1);
    this.changeHp(cultivator, randomBetween(8, 16));
    this.changeMana(cultivator, randomBetween(12, 22));
    this.appendLog(logs, `闭关静修，修为精进 ${gain} 点。`);

    if (Math.random() < 0.18) {
      const insight = randomBetween(2, 6);
      cultivator.attributes.comprehension = clamp(cultivator.attributes.comprehension + insight, 40, 130);
      this.appendLog(logs, `心有所悟，悟性提升 ${insight} 点。`);
    }

    this.checkLifespanAndUpdate(cultivator, logs, 'meditate');
  },

  seekAdventure() {
    if (!this.ensureAlive()) return;
    const cultivator = this.cloneCultivator();
    const logs = this.cloneLog();
    const chance = pickFrom(OPPORTUNITIES);
    const value = randomBetween(chance.min, chance.max);

    switch (chance.effect) {
      case 'progress':
        cultivator.progress = clamp(cultivator.progress + value, 0, 120);
        this.appendLog(logs, `${chance.title}，${chance.desc} 修为增长 ${value} 点。`);
        break;
      case 'resource':
        cultivator.resources.spiritStones += value;
        this.appendLog(logs, `${chance.title}，获得灵石 ${value} 枚。`);
        break;
      case 'injury':
        cultivator.attributes.physique = clamp(cultivator.attributes.physique - value / 2, 35, 120);
        this.changeHp(cultivator, -value * 4);
        this.appendLog(logs, `${chance.title}，体魄受损 ${Math.round(value / 2)} 点。`);
        break;
      case 'attribute':
        cultivator.attributes[chance.attr] = clamp(cultivator.attributes[chance.attr] + value, 35, 135);
        this.appendLog(logs, `${chance.title}，${chance.attr === 'comprehension' ? '悟性' : '体魄'}提升 ${value} 点。`);
        break;
      case 'luck':
        cultivator.attributes.luck = clamp(cultivator.attributes.luck + value, 35, 150);
        this.appendLog(logs, `${chance.title}，气运提升 ${value} 点。`);
        break;
      case 'lifespan':
        cultivator.resources.elixirs += 1;
        this.appendLog(logs, `${chance.title}，额外获得一枚续命灵丹。`);
        break;
      case 'setback':
        cultivator.progress = clamp(cultivator.progress - Math.min(cultivator.progress, value), 0, 120);
        this.appendLog(logs, `${chance.title}，修为倒退 ${value} 点。`);
        break;
      default:
        break;
    }

    this.consumeTime(cultivator, randomBetween(1, 3));
    this.changeMana(cultivator, -randomBetween(8, 16));
    this.checkLifespanAndUpdate(cultivator, logs, 'adventure');
  },

  consumeElixir() {
    if (!this.ensureAlive()) return;
    const cultivator = this.cloneCultivator();
    const logs = this.cloneLog();

    if (cultivator.resources.elixirs <= 0) {
      wx.showToast({ title: '灵丹耗尽', icon: 'none' });
      return;
    }

    cultivator.resources.elixirs -= 1;
    const gain = randomBetween(20, 35);
    cultivator.progress = clamp(cultivator.progress + gain, 0, 120);
    cultivator.attributes.physique = clamp(cultivator.attributes.physique + 2, 35, 140);
    cultivator.age = Math.max(18, cultivator.age - 1);
    this.changeHp(cultivator, Math.round(cultivator.stats.maxHp * 0.35));
    this.changeMana(cultivator, Math.round(cultivator.stats.maxMana * 0.4));
    this.appendLog(logs, `服下一枚灵丹，修为提升 ${gain} 点，寿元回溯一年。`);

    this.checkLifespanAndUpdate(cultivator, logs, 'elixir');
  },

  accumulateYears() {
    if (!this.ensureAlive()) return;
    const cultivator = this.cloneCultivator();
    const logs = this.cloneLog();
    const years = randomBetween(2, 5);

    this.consumeTime(cultivator, years);
    const decay = randomBetween(1, 3);
    cultivator.attributes.luck = clamp(cultivator.attributes.luck - decay, 30, 150);
    this.changeMana(cultivator, randomBetween(4, 9));
    this.changeHp(cultivator, randomBetween(2, 6));
    this.appendLog(logs, `岁月静流，闭门思过 ${years} 年，气运损耗 ${decay} 点。`);

    this.checkLifespanAndUpdate(cultivator, logs, 'years');
  },

  attemptBreakthrough() {
    if (!this.ensureAlive()) return;
    const cultivator = this.cloneCultivator();
    const logs = this.cloneLog();

    if (cultivator.realmIndex >= REALM_STAGES.length - 1) {
      this.appendLog(logs, '你已伫立飞升之巅，需等待天门开启。');
      this.refreshState(cultivator, logs, true);
      wx.showToast({ title: '已至终境', icon: 'none' });
      return;
    }

    if (cultivator.progress < 100) {
      wx.showToast({ title: '修为未满', icon: 'none' });
      return;
    }

    this.changeMana(cultivator, -Math.round(cultivator.stats.maxMana * 0.3));
    const stage = REALM_STAGES[cultivator.realmIndex];
    const baseChance = 1 - stage.difficulty;
    const luckBonus = cultivator.attributes.luck / 200;
    const finalChance = clamp(baseChance + luckBonus, 0.15, 0.95);
    const success = Math.random() < finalChance;
    const previousRank = cultivator.sectRank;

    if (success) {
      cultivator.realmIndex += 1;
      cultivator.progress = 0;
      cultivator.resources.spiritStones += randomBetween(20, 40);
      cultivator.fame += randomBetween(5, 12);
      this.changeHp(cultivator, Math.round(cultivator.stats.maxHp * 0.25));
      this.changeMana(cultivator, Math.round(cultivator.stats.maxMana * 0.2));
      this.assignSectRank(cultivator);
      this.appendLog(logs, `突破成功，踏入${REALM_STAGES[cultivator.realmIndex].name}境！`);
      if (cultivator.sectRank !== previousRank) {
        this.appendLog(logs, `宗门对你的评价提升为【${cultivator.sectRank}】。`);
      }

      if (REALM_STAGES[cultivator.realmIndex].name === '飞升') {
        this.appendLog(logs, '雷海散尽，仙门大开，你羽化飞升。');
        this.refreshState(cultivator, logs, true);
        this.setData({ gameOver: true });
        this.showEndingModal(true);
        return;
      }
    } else {
      const setback = randomBetween(20, 35);
      cultivator.progress = clamp(cultivator.progress - setback, 0, 120);
      cultivator.attributes.luck = clamp(cultivator.attributes.luck - randomBetween(3, 8), 25, 140);
      this.changeHp(cultivator, -randomBetween(18, 32));
      this.appendLog(logs, `突破失败，修为倒退 ${setback} 点。`);
    }

    this.consumeTime(cultivator, randomBetween(1, 3));
    this.checkLifespanAndUpdate(cultivator, logs, 'breakthrough');
  },

  spendStonesForElixir() {
    if (!this.ensureAlive()) return;
    const cultivator = this.cloneCultivator();
    const logs = this.cloneLog();

    if (cultivator.resources.spiritStones < 30) {
      wx.showToast({ title: '灵石不足', icon: 'none' });
      return;
    }

    cultivator.resources.spiritStones -= 30;
    cultivator.resources.elixirs += 1;
    this.changeMana(cultivator, -randomBetween(4, 8));
    this.appendLog(logs, '消耗 30 枚灵石，炼制出一枚续命灵丹。');
    this.consumeTime(cultivator, 1);
    this.checkLifespanAndUpdate(cultivator, logs, 'craft');
  },

  checkLifespanAndUpdate(cultivator, logs, reason = 'general', allowIncident = true) {
    const lifespanCeiling = this.calculateLifespan(cultivator);
    if (cultivator.age >= lifespanCeiling) {
      this.appendLog(logs, '寿元燃尽，肉身化作飞灰。');
      this.refreshState(cultivator, logs, true);
      this.setData({ gameOver: true });
      this.showEndingModal(false);
      return;
    }

    this.refreshState(cultivator, logs, true);
    if (allowIncident) {
      this.maybeTriggerIncident(reason);
    }
  },

  maybeTriggerIncident(reason) {
    if (this.data.gameOver || !this.data.cultivator) return;
    if (this.incidentLock) return;
    const normalized = Object.prototype.hasOwnProperty.call(INCIDENT_CHANCE, reason) ? reason : 'general';
    const triggerChance = INCIDENT_CHANCE[normalized];
    if (!triggerChance) return;
    const now = Date.now();
    if (now - (this.lastIncidentAt || 0) < 3200) return;
    if (Math.random() > triggerChance) return;
    const incident = this.generateIncident(reason);
    if (!incident) return;

    this.lastIncidentAt = now;
    this.incidentLock = true;
    wx.showModal({
      title: incident.title,
      content: incident.content,
      showCancel: incident.showCancel !== false,
      confirmText: incident.confirmText || '迎战',
      cancelText: incident.cancelText || '退避',
      success: (res) => {
        const cultivator = this.cloneCultivator();
        const logs = this.cloneLog();
        if (!cultivator || !logs) {
          this.incidentLock = false;
          return;
        }

        if (res.confirm) {
          incident.onConfirm && incident.onConfirm.call(this, cultivator, logs);
        } else if (incident.onCancel) {
          incident.onCancel.call(this, cultivator, logs);
        } else {
          this.appendLog(logs, '你选择暂避锋芒。');
        }

        this.incidentLock = false;
        this.checkLifespanAndUpdate(cultivator, logs, 'incident', false);
      },
      complete: () => {
        this.incidentLock = false;
      }
    });
  },

  generateIncident(reason) {
    const cultivator = this.data.cultivator;
    if (!cultivator) return null;
    const builders = [
      () => this.buildChallengeIncident(cultivator, reason),
      () => this.buildSectAttackIncident(cultivator, reason),
      () => this.buildPartnerSnatchIncident(cultivator, reason),
      () => this.buildPartnerBetrayIncident(cultivator, reason),
      () => this.buildDangerousInvitationIncident(cultivator, reason),
      () => this.buildTribulationInterferenceIncident(cultivator, reason)
    ];
    const candidates = builders.map((fn) => fn()).filter(Boolean);
    if (!candidates.length) return null;
    return pickFrom(candidates);
  },

  buildChallengeIncident(cultivator, reason) {
    if (!['meditate', 'adventure', 'years', 'craft', 'elixir'].includes(reason)) return null;
    const battleground = pickFrom(LOCATION_NAMES);
    const opener = pickFrom(BATTLE_OPENERS);
    const opponent = this.createOpponentProfile(cultivator);
    const canSense = cultivator.attributes.sense >= opponent.sense;
    const insight = canSense
      ? `神识探查：${opponent.realmName} · 攻${opponent.attack} 防${opponent.defense} 血${opponent.maxHp} 蓝${opponent.maxMana}`
      : '神识不足，无法洞悉对方底蕴。';
    return {
      key: 'duel',
      title: `${opponent.sect}弟子上门`,
      content: `${opener}。${opponent.sect}派出${opponent.name}${opponent.title}堵在${battleground}外，若迎战或可夺其剑录，拒绝则被视作畏战。\n${insight}`,
      confirmText: '迎战',
      cancelText: '婉拒',
      onConfirm: (cult, logs) => {
        this.resolveDuel(cult, logs, opponent);
        this.consumeTime(cult, 1);
      },
      onCancel: (cult, logs) => {
        const loss = randomBetween(2, 4);
        cult.attributes.luck = clamp(cult.attributes.luck - loss, 20, 160);
        cult.fame = Math.max(0, (cult.fame || 0) - 3);
        this.changeMana(cult, -randomBetween(3, 6));
        this.appendLog(logs, `${opponent.sect}弟子耻笑你畏战，气运流失 ${loss} 点。`);
      }
    };
  },

  buildSectAttackIncident(cultivator, reason) {
    if (!['meditate', 'adventure', 'years', 'craft'].includes(reason)) return null;
    const sect = pickFrom(SECT_NAMES);
    const scene = pickFrom(SIEGE_SCENES);
    const refuge = pickFrom(LOCATION_NAMES);
    return {
      key: 'siege',
      title: `${sect}攻山`,
      content: `${scene}。${sect}调遣${pickFrom(ENEMY_TITLES)}率众逼近你的洞府，若迎战可守护基业，若撤离需付出重宝。`,
      confirmText: '迎战',
      cancelText: '转移门庭',
      onConfirm: (cult, logs) => {
        const winChance = Math.min(0.9, 0.4 + (cult.stats.attack + cult.stats.defense) / 500 + cult.attributes.physique / 260);
        if (Math.random() < winChance) {
          const reward = randomBetween(20, 40);
          cult.resources.spiritStones += reward;
          cult.attributes.luck = clamp(cult.attributes.luck + randomBetween(2, 6), 20, 170);
          this.appendLog(logs, `${sect}被你击退，缴获灵石 ${reward} 枚。`);
        } else {
          const wound = randomBetween(10, 18);
          cult.attributes.physique = clamp(cult.attributes.physique - wound, 25, 140);
          const loss = randomBetween(12, 22);
          cult.progress = clamp(cult.progress - loss, 0, 120);
          this.changeHp(cult, -wound * 6);
          this.appendLog(logs, `${sect}攻势凶猛，你受创并损失 ${loss} 点修为。`);
        }
        this.changeMana(cult, -randomBetween(10, 18));
        this.consumeTime(cult, randomBetween(1, 2));
      },
      onCancel: (cult, logs) => {
        const loss = randomBetween(15, 28);
        cult.resources.spiritStones = Math.max(0, cult.resources.spiritStones - loss);
        cult.fame = Math.max(0, (cult.fame || 0) - 5);
        this.consumeTime(cult, 1);
        this.changeMana(cult, -randomBetween(4, 8));
        this.appendLog(logs, `你迁往${refuge}暂避，损失灵石 ${loss} 枚，威望受损。`);
      }
    };
  },

  buildPartnerSnatchIncident(cultivator, reason) {
    if (!cultivator.partnerName) return null;
    if (!['meditate', 'adventure', 'years', 'elixir'].includes(reason)) return null;
    const sect = pickFrom(SECT_NAMES);
    const rival = pickFrom(DAO_NAMES);
    const duelGround = pickFrom(LOCATION_NAMES);
    const approach = pickFrom(BATTLE_OPENERS);
    const opponent = this.createOpponentProfile(cultivator);
    opponent.name = rival;
    opponent.sect = sect;
    return {
      key: 'partner-snatch',
      title: `${sect}夺侣`,
      content: `${approach}。${sect}的${rival}在${duelGround}外扬言要带走${cultivator.partnerName}，要么拱手相让，要么力战到底。`,
      confirmText: '力战到底',
      cancelText: '拱手相让',
      onConfirm: (cult, logs) => {
        this.resolveDuel(cult, logs, opponent, `${rival}被你击退，${cult.partnerName}更加信服。`);
        this.consumeTime(cult, 1);
      },
      onCancel: (cult, logs) => {
        cult.partnerName = null;
        const loss = randomBetween(3, 6);
        cult.attributes.comprehension = clamp(cult.attributes.comprehension - loss, 30, 140);
        this.changeMana(cult, -randomBetween(2, 5));
        this.appendLog(logs, `你忍痛放手，道心受挫，悟性下降 ${loss} 点。`);
      }
    };
  },

  buildPartnerBetrayIncident(cultivator, reason) {
    if (!cultivator.partnerName) return null;
    if (reason === 'breakthrough') return null;
    if (Math.random() > 0.45) return null;
    const loss = randomBetween(8, 15);
    return {
      key: 'betrayal',
      title: '道侣背叛',
      content: `${cultivator.partnerName}暗中离去，你受情伤，气运将减少 ${loss} 点。`,
      confirmText: '唏嘘离别',
      showCancel: false,
      onConfirm: (cult, logs) => {
        const name = cult.partnerName;
        cult.attributes.luck = clamp(cult.attributes.luck - loss, 10, 150);
        cult.partnerName = null;
        this.changeMana(cult, -randomBetween(5, 9));
        this.appendLog(logs, `${name}背弃誓言，气运损失 ${loss} 点。`);
        this.consumeTime(cult, 1);
      }
    };
  },

  buildDangerousInvitationIncident(cultivator, reason) {
    if (!['meditate', 'adventure', 'years'].includes(reason)) return null;
    const ally = pickFrom(DAO_NAMES);
    const zone = pickFrom(DANGER_ZONES);
    const motive = pickFrom(INVITATION_MOTIVES);
    return {
      key: 'invitation',
      title: `${ally}的邀约`,
      content: `${ally}邀请你一同前往${zone}寻宝，只因${motive}，此地却被称为人界最凶。是否同行？`,
      confirmText: '同行',
      cancelText: '谢绝',
      onConfirm: (cult, logs) => {
        const successChance = Math.min(0.93, 0.5 + (cult.stats.attack + cult.attributes.luck) / 400);
        this.changeMana(cult, -randomBetween(10, 18));
        if (Math.random() < successChance) {
          const reward = randomBetween(30, 60);
          cult.resources.spiritStones += reward;
          cult.progress = clamp(cult.progress + randomBetween(8, 16), 0, 120);
          cult.attributes.luck = clamp(cult.attributes.luck + randomBetween(3, 7), 20, 180);
          this.appendLog(logs, `你与${ally}在${zone}斩获奇珍，灵石 +${reward}。`);
        } else {
          const injury = randomBetween(8, 16);
          cult.attributes.physique = clamp(cult.attributes.physique - injury, 25, 140);
          const decay = randomBetween(2, 5);
          cult.attributes.luck = clamp(cult.attributes.luck - decay, 15, 150);
          this.changeHp(cult, -injury * 4);
          this.appendLog(logs, `${zone}凶险莫测，你受伤，气运流逝 ${decay} 点。`);
        }
        this.consumeTime(cult, randomBetween(2, 4));
      },
      onCancel: (cult, logs) => {
        const regret = randomBetween(1, 3);
        cult.attributes.luck = clamp(cult.attributes.luck - regret, 15, 150);
        this.appendLog(logs, `你婉拒${ally}，错失机缘，气运损失 ${regret} 点。`);
      }
    };
  },

  buildTribulationInterferenceIncident(cultivator, reason) {
    if (reason !== 'breakthrough') return null;
    const sect = pickFrom(SECT_NAMES);
    return {
      key: 'tribulation',
      title: '渡劫被扰',
      content: `${sect}派出${pickFrom(ENEMY_TITLES)}扰乱你的雷劫，是否强撑渡劫？`,
      confirmText: '强撑渡劫',
      cancelText: '暂避锋芒',
      onConfirm: (cult, logs) => {
        const chance = Math.min(0.95, 0.55 + (cult.attributes.comprehension + cult.attributes.sense) / 450);
        this.changeMana(cult, -randomBetween(12, 20));
        if (Math.random() < chance) {
          const gain = randomBetween(10, 18);
          cult.progress = clamp(cult.progress + gain, 0, 120);
          cult.attributes.luck = clamp(cult.attributes.luck + randomBetween(4, 8), 20, 185);
          cult.fame = (cult.fame || 0) + randomBetween(6, 10);
          this.appendLog(logs, `你顶住外敌，雷劫更加澎湃，修为额外精进 ${gain} 点。`);
        } else {
          const setback = randomBetween(15, 25);
          cult.progress = clamp(cult.progress - setback, 0, 120);
          cult.attributes.physique = clamp(cult.attributes.physique - randomBetween(6, 12), 20, 140);
          this.changeHp(cult, -randomBetween(20, 35));
          cult.age += 2;
          this.appendLog(logs, `外敌搅乱雷势，你受创倒退 ${setback} 点修为。`);
        }
      },
      onCancel: (cult, logs) => {
        const penalty = randomBetween(8, 14);
        cult.progress = clamp(cult.progress - penalty, 0, 120);
        cult.attributes.luck = clamp(cult.attributes.luck - randomBetween(3, 6), 15, 160);
        this.appendLog(logs, `你被迫暂避，修为倒退 ${penalty} 点，雷劫推迟。`);
        this.consumeTime(cult, 1);
      }
    };
  },

  resolveDuel(cult, logs, opponent, customWinText) {
    const playerPower = cult.stats.attack + cult.stats.defense + cult.attributes.luck + cult.attributes.sense;
    const opponentPower = opponent.attack + opponent.defense + opponent.luck + opponent.sense;
    const winChance = clamp(0.35 + (playerPower - opponentPower) / 700, 0.08, 0.95);
    const manaCost = randomBetween(6, 12);
    this.changeMana(cult, -manaCost);

    if (Math.random() < winChance) {
      const gain = randomBetween(14, 24);
      cult.progress = clamp(cult.progress + gain, 0, 120);
      cult.fame = (cult.fame || 0) + randomBetween(4, 9);
      const heal = randomBetween(6, 12);
      this.changeHp(cult, heal);
      this.appendLog(logs, customWinText || `${opponent.name}被你击退，${opponent.realmName}剑意崩碎，修为精进 ${gain} 点。`);
    } else {
      const loss = randomBetween(12, 20);
      cult.progress = clamp(cult.progress - loss, 0, 120);
      const hpLoss = Math.round(opponent.attack * randomBetween(4, 7));
      this.changeHp(cult, -hpLoss);
      const luckLoss = randomBetween(4, 8);
      cult.attributes.luck = clamp(cult.attributes.luck - luckLoss, 10, 160);
      this.appendLog(logs, `${opponent.name}掌握${opponent.realmName}秘术，你受创倒退 ${loss} 点修为，气血流逝 ${hpLoss}。`);
    }
  },

  showEndingModal(ascended) {
    wx.showModal({
      title: ascended ? '飞升成功' : '坐化归寂',
      content: ascended ? '你已破碎虚空，是否重开新一世？' : '寿元耗尽，是否转世重修？',
      confirmText: '重开',
      cancelText: '稍后',
      success: (res) => {
        if (res.confirm) {
          app?.clearCultivatorProfile ? app.clearCultivatorProfile() : wx.removeStorageSync('cultivatorProfile');
          this.startNewJourney();
          this.setData({ gameOver: false });
        }
      }
    });
  },

  createOpponentProfile(cultivator) {
    const realmIndex = clamp(cultivator.realmIndex + randomBetween(-1, 2), 0, REALM_STAGES.length - 1);
    const multiplier = 1 + realmIndex * 0.25;
    return {
      name: pickFrom(DAO_NAMES),
      sect: pickFrom(SECT_NAMES),
      title: pickFrom(ENEMY_TITLES),
      realmName: REALM_STAGES[realmIndex].name,
      realmIndex,
      attack: Math.round((cultivator.stats.attack || 80) * randomBetween(80, 120) / 100),
      defense: Math.round((cultivator.stats.defense || 70) * randomBetween(80, 120) / 100),
      maxHp: Math.round((cultivator.stats.maxHp || 200) * randomBetween(75, 115) / 100 * multiplier / (1 + cultivator.realmIndex * 0.05)),
      maxMana: Math.round((cultivator.stats.maxMana || 180) * randomBetween(75, 115) / 100),
      luck: randomBetween(40, 120),
      sense: randomBetween(45 + realmIndex * 6, 95 + realmIndex * 8)
    };
  }
});