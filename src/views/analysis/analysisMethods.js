/*
 * @Author: truxcoder
 * @Date: 2023-01-12 10:33:37
 * @LastEditTime: 2023-05-06 16:57:18
 * @LastEditors: truxcoder
 * @Description:
 */

function fmt(number) {
  return (number * 100).toFixed(2)
}
export function getAgeOverviewOption(v) {
  return {
    title: {
      text: '年龄概况',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {},
    xAxis: {
      data: ['全体人员', '男民警', '女民警', '正科级', '副科级']
    },
    yAxis: {},
    series: [
      {
        name: '平均年龄',
        type: 'bar',
        data: [(v['total'] / (v['num'] || 1)).toFixed(2), (v['maleTotal'] / (v['maleNum'] || 1)).toFixed(2), (v['femaleTotal'] / (v['femaleNum'] || 1)).toFixed(2), (v['zkTotal'] / (v['zkNum'] || 1)).toFixed(2), (v['fkTotal'] / (v['fkNum'] || 1)).toFixed(2)]
      },
      {
        name: '最大年龄',
        type: 'bar',
        data: [v['oldest'], v['maleOldest'], v['femaleOldest'], v['zkOldest'], v['fkOldest']]
      },
      {
        name: '最小年龄',
        type: 'bar',
        data: [v['youngest'], v['maleYoungest'], v['femaleYoungest'], v['zkYoungest'], v['fkYoungest']]
      }
    ]
  }
}

/**
 * 领导年龄概述
 */
export function getLeaderAgeOverviewOption(v) {
  v = v ?? {}
  return {
    title: {
      text: '年龄概况',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {},
    xAxis: {
      data: ['班子成员', '副处级']
    },
    yAxis: {},
    series: [
      {
        name: '平均年龄',
        type: 'bar',
        data: [((v['total'] || 0) / (v['num'] || 1)).toFixed(2), ((v['fcTotal'] || 0) / (v['fcNum'] || 1)).toFixed(2)]
      },
      {
        name: '最大年龄',
        type: 'bar',
        data: [v['oldest'] || 0, v['fcOldest'] || 0]
      },
      {
        name: '最小年龄',
        type: 'bar',
        data: [v['youngest'] || 0, v['fcYoungest'] || 0]
      }
    ]
  }
}

export function getAgeDisOption(v) {
  return {
    title: {
      text: '年龄分布',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {},
    xAxis: {
      data: ['20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '全体民警',
        type: 'line',
        data: [v['20-24'], v['25-29'], v['30-34'], v['35-39'], v['40-44'], v['45-49'], v['50-54'], v['55-59']],
        label: {
          show: true,
          position: 'top'
        }
      },
      {
        name: '正科级',
        type: 'line',
        data: [v['zk-20-24'], v['zk-25-29'], v['zk-30-34'], v['zk-35-39'], v['zk-40-44'], v['zk-45-49'], v['zk-50-54'], v['zk-55-59']],
        label: {
          show: true,
          position: 'top'
        }
      },
      {
        name: '副科级',
        type: 'line',
        data: [v['fk-20-24'], v['fk-25-29'], v['fk-30-34'], v['fk-35-39'], v['fk-40-44'], v['fk-45-49'], v['fk-50-54'], v['fk-55-59']],
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
}

export function getLeaderAgeDisOption(v) {
  v = v ?? {}
  return {
    title: {
      text: '年龄分布',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {},
    radar: {
      // shape: 'circle',
      axisName: {
        formatter: '【{value}】',
        color: '#428BD4'
      },
      splitArea: {
        areaStyle: {
          color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      },
      indicator: [
        { name: '30-34', max: 5 },
        { name: '35-39', max: 5 },
        { name: '40-44', max: 5 },
        { name: '45-49', max: 5 },
        { name: '50-54', max: 5 },
        { name: '55-59', max: 5 }
      ]
    },
    series: [
      {
        name: '副处级',
        type: 'radar',
        data: [{
          value: [v['fc-30-34'], v['fc-35-39'], v['fc-40-44'], v['fc-45-49'], v['fc-50-54'], v['fc-55-59']],
          areaStyle: {
            color: 'rgba(255, 228, 52, 0.6)'
          }
        }],
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
}

export function getEduAllOption(v, o) {
  const other = (o.use || 0) - (v.yjs || 0) - (v.bk || 0) - (v.zk || 0)
  const other_qrz = (o.use || 0) - (v.qrzyjs || 0) - (v.qrzbk || 0) - (v.qrzzk || 0)
  return {
    title: {
      text: '全体民警学历分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      // orient: 'horizontal',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: [0, '30%'],
        data: [
          {
            value: v.qrzyjs || 0,
            name: '全日制研究生'
          },
          {
            value: v.qrzbk || 0,
            name: '全日制本科'
          },
          {
            value: v.qrzzk || 0,
            name: '全日制专科'
          },
          {
            value: other_qrz,
            name: '全日制其他'
          }
        ]
      },
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: ['45%', '60%'],
        data: [
          {
            value: v.yjs || 0,
            name: '研究生'
          },
          {
            value: v.bk || 0,
            name: '本科'
          },
          {
            value: v.zk || 0,
            name: '专科'
          },
          {
            value: other,
            name: '其他'
          }
        ]
      }
    ]
  }
}

export function getEduZkOption(v, o) {
  const other = (o.zk || 0) - (v.yjs_zk || 0) - (v.bk_zk || 0) - (v.zk_zk || 0)
  const other_qrz = (o.zk || 0) - (v.qrzyjs_zk || 0) - (v.qrzbk_zk || 0) - (v.qrzzk_zk || 0)
  return {
    title: {
      text: '正科级干部学历分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      // orient: 'horizontal',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: [0, '30%'],
        data: [
          {
            value: v.qrzyjs_zk || 0,
            name: '全日制研究生'
          },
          {
            value: v.qrzbk_zk || 0,
            name: '全日制本科'
          },
          {
            value: v.qrzzk_zk || 0,
            name: '全日制专科'
          },
          {
            value: other_qrz,
            name: '全日制其他'
          }
        ]
      },
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: ['45%', '60%'],
        data: [
          {
            value: v.yjs_zk || 0,
            name: '研究生'
          },
          {
            value: v.bk_zk || 0,
            name: '本科'
          },
          {
            value: v.zk_zk || 0,
            name: '专科'
          },
          {
            value: other,
            name: '其他'
          }
        ]
      }
    ]
  }
}

export function getEduFkOption(v, o) {
  const other = (o.fk || 0) - (v.yjs_fk || 0) - (v.bk_fk || 0) - (v.zk_fk || 0)
  const other_qrz = (o.fk || 0) - (v.qrzyjs_fk || 0) - (v.qrzbk_fk || 0) - (v.qrzzk_fk || 0)
  return {
    title: {
      text: '副科级干部学历分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      // orient: 'horizontal',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: [0, '30%'],
        data: [
          {
            value: v.qrzyjs_fk || 0,
            name: '全日制研究生'
          },
          {
            value: v.qrzbk_fk || 0,
            name: '全日制本科'
          },
          {
            value: v.qrzzk_fk || 0,
            name: '全日制专科'
          },
          {
            value: other_qrz,
            name: '全日制其他'
          }
        ]
      },
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: ['45%', '60%'],
        data: [
          {
            value: v.yjs_fk || 0,
            name: '研究生'
          },
          {
            value: v.bk_fk || 0,
            name: '本科'
          },
          {
            value: v.zk_fk || 0,
            name: '专科'
          },
          {
            value: other,
            name: '其他'
          }
        ]
      }
    ]
  }
}

export function getLeaderEduOption(v, n) {
  const other = n - (v.yjs || 0) - (v.bk || 0) - (v.zk || 0)
  const other_qrz = n - (v.qrzyjs || 0) - (v.qrzbk || 0) - (v.qrzzk || 0)
  return {
    title: {
      text: '学历分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      // orient: 'horizontal',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: [0, '30%'],
        data: [
          {
            value: v.qrzyjs || 0,
            name: '全日制研究生'
          },
          {
            value: v.qrzbk || 0,
            name: '全日制本科'
          },
          {
            value: v.qrzzk || 0,
            name: '全日制专科'
          },
          {
            value: other_qrz,
            name: '全日制其他'
          }
        ]
      },
      {
        type: 'pie',
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}:{c}'
        },
        radius: ['45%', '60%'],
        data: [
          {
            value: v.yjs || 0,
            name: '研究生'
          },
          {
            value: v.bk || 0,
            name: '本科'
          },
          {
            value: v.zk || 0,
            name: '专科'
          },
          {
            value: other,
            name: '其他'
          }
        ]
      }
    ]
  }
}

export function getLeaderPostOption(v) {
  v = v ?? {}
  return {
    title: {
      text: '任职结构',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {},
    radar: {
      // shape: 'circle',
      axisName: {
        formatter: '【{value}】',
        color: '#428BD4'
      },
      splitArea: {
        areaStyle: {
          color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(211, 253, 250, 0.8)'
        }
      },
      indicator: [
        { name: '低于2年', max: 7 },
        { name: '大于等于2年', max: 7 },
        { name: '大于等于5年', max: 7 },
        { name: '大于等于10年', max: 7 },
        { name: '1个职位经历', max: 7 },
        { name: '2个职位经历', max: 7 },
        { name: '3个及以上职位经历', max: 7 }
      ]
    },
    series: [
      {
        name: '副处级',
        type: 'radar',
        data: [{
          value: [v['year1'], v['year2'], v['year5'], v['year10'], v['post1'], v['post2'], v['post3']],
          areaStyle: {
            color: 'rgba(255, 228, 52, 0.6)'
          }
        }],
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
}

export function getOverviewString(o, v, age, edu) {
  return `${o.shortName}核定政法专项编制${v.headcount}名，实有${v.use}人，男女占比${v.male}:${v.female}，
  平均年龄${(age['total'] / (age['num'] || 1)).toFixed(2)}岁，党员占比${fmt((v.communist) / (v.use || 1))}%（含预备党员），
  本科及以上学历占比${fmt((edu['bk'] || 0) / v.use)}%，少数民族${v.minority}人，
  副厅级${v.ft}人，正处级${v.zc}人，副处级${v.fc}人，正科级${v.zk}人，副科级${v.fk}人。`
}

export function getLeaderOverviewString(o, v, p) {
  return `${o.shortName}核定正处级领导职数${p.zc || 0}名，实配${v.zc}人，副处级领导职数${p.fc || 0}名，实配${v.fc}人。班子成员男干部${v.male}人，女干部${v.female}人，少数民族干部${v.minority}人。`
}

export function getHeadcountString(o, h, v) {
  return `${o.shortName}正处级领导职数${h.zc}名，实配${v.zc}人；副处级领导职数${h.fc}名，实配${v.fc}人；正科级领导职数${h.zk}名，实配${v.zk}人；副科级领导职数${h.fk}名，实配${v.fk}人。`
}

export function getAgeString(o, v) {
  return `${o.shortName}平均年龄${(v['total'] / (v['num'] || 1)).toFixed(2)}岁，
  最大${v['oldest']}岁，最小${v['youngest']}岁。
  男民警平均年龄${(v['maleTotal'] / (v['maleNum'] || 1)).toFixed(2)}岁，
  最大${v['maleOldest']}岁，最小${v['maleYoungest']}岁。
  女民警平均年龄${(v['femaleTotal'] / (v['femaleNum'] || 1)).toFixed(2)}岁，
  最大${v['femaleOldest']}岁，最小${v['femaleYoungest']}岁。
  20-24岁${v['20-24']}人，25-29岁${v['25-29']}人，
  30-34岁${v['30-34']}人，35-39岁${v['35-39']}人，
  40-44岁${v['40-44']}人，45-49岁${v['45-49']}人，
  50-54岁${v['50-54']}人，55-59岁${v['55-59']}人，
  其中两年内退休人员${v['willRetire']}人。<br />
  正科级领导干部平均年龄${(v['zkTotal'] / (v['zkNum'] || 1)).toFixed(2)}岁，
  最大${v['zkOldest']}岁，最小${v['zkYoungest']}岁。
  副科级领导干部平均年龄${(v['fkTotal'] / (v['fkNum'] || 1)).toFixed(2)}岁，
  最大${v['fkOldest']}岁，最小${v['fkYoungest']}岁。
  科级领导干部中，30岁以下${v['zk-20-24'] + v['fk-20-24'] + v['zk-25-29'] + v['fk-25-29']}人，
  正科级${v['zk-20-24'] + v['zk-25-29']}人，副科级${v['fk-20-24'] + v['fk-25-29']}人。
  30-34岁${v['zk-30-34'] + v['fk-30-34']}人，
  正科级${v['zk-30-34']}人，副科级${v['fk-30-34']}人。
  35-39岁${v['zk-35-39'] + v['fk-35-39']}人，
  正科级${v['zk-35-39']}人，副科级${v['fk-35-39']}人。
  40-44岁${v['zk-40-44'] + v['fk-40-44']}人，
  正科级${v['zk-40-44']}人，副科级${v['fk-40-44']}人。
  45-49岁${v['zk-45-49'] + v['fk-45-49']}人，
  正科级${v['zk-45-49']}人，副科级${v['fk-45-49']}人。
  50-54岁${v['zk-50-54'] + v['fk-50-54']}人，
  正科级${v['zk-50-54']}人，副科级${v['fk-50-54']}人。
  55岁以上${v['zk-55-59'] + v['fk-55-59']}人，
  正科级${v['zk-55-59']}人，副科级${v['fk-55-59']}人。`
}

export function getLeaderAgeString(o, v) {
  v = v ?? {}
  return `${o.shortName}班子成员平均年龄${((v['total'] || 0) / (v['num'] || 1)).toFixed(2)}岁，
  最大${v['oldest'] || 0}岁，最小${v['youngest'] || 0}岁。
  其中副处级领导干部平均年龄${((v['fcTotal'] || 0) / (v['fcNum'] || 1)).toFixed(2)}岁，
  最大${v['fcOldest'] || 0}岁，最小${v['fcYoungest'] || 0}岁。
  30-34岁${v['30-34'] || 0}人，35-39岁${v['35-39'] || 0}人，
  40-44岁${v['40-44'] || 0}人，45-49岁${v['45-49'] || 0}人，
  50-54岁${v['50-54'] || 0}人，已满54岁副处级领导${v['55-59'] || 0}人，
  (副处级领导干部60后${v['fc-60er'] || 0}人，70后${v['fc-70er'] || 0}人，80后${v['fc-80er'] || 0}人，90后${v['fc-90er'] || 0}人）。`
}

export function getEduString(o, v, overview) {
  const use = overview.use || 1
  const zk = overview.zk || 1
  const fk = overview.fk || 1
  return `${o.shortName}研究生${v['yjs'] || 0}人，占比${fmt((v['yjs'] || 0) / use)}%
  （全日制硕士研究生${v['qrzyjs'] || 0}人，占比${fmt((v['qrzyjs'] || 0) / use)}%），
  本科${v['bk'] || 0}人，占比${fmt((v['bk'] || 0) / use)}%（全日制本科学历${v['qrzbk'] || 0}人，占比${fmt((v['qrzbk'] || 0) / use)}%），
  专科${v['zk'] || 0}人，占比${fmt((v['zk'] || 0) / use)}%（全日制专科学历${v['qrzzk'] || 0}人，占比${fmt((v['qrzzk'] || 0) / use)}%）。<br />
  正科级干部研究生学历${v['yjs_zk'] || 0}人，占比${fmt((v['yjs_zk'] || 0) / zk)}%，
  大学学历${v['bk_zk'] || 0}人，占比${fmt((v['bk_zk'] || 0) / zk)}%，
  大专学历${v['zk_zk'] || 0}人，占比${fmt((v['zk_zk'] || 0) / zk)}%
  （全日制硕士研究生学历${v['qrzyjs_zk'] || 0}人，占比${fmt((v['qrzyjs_zk'] || 0) / zk)}%，
  全日制本科学历${v['qrzbk_zk'] || 0}人，占比${fmt((v['qrzbk_zk'] || 0) / zk)}%，
  全日制大专学历${v['qrzzk_zk'] || 0}人，占比${fmt((v['qrzzk_zk'] || 0) / zk)}%。）。<br />
  副科级干部研究生学历${v['yjs_fk'] || 0}人，占比${fmt((v['yjs_fk'] || 0) / fk)}%，
  大学学历${v['bk_fk'] || 0}人，占比${fmt((v['bk_fk'] || 0) / fk)}%，
  大专学历${v['zk_fk'] || 0}人，占比${fmt((v['zk_fk'] || 0) / fk)}%
  （全日制硕士研究生学历${v['qrzyjs_fk'] || 0}人，占比${fmt((v['qrzyjs_fk'] || 0) / fk)}%，
  全日制本科学历${v['qrzbk_fk'] || 0}人，占比${fmt((v['qrzbk_fk'] || 0) / fk)}%，
  全日制大专学历${v['qrzzk_fk'] || 0}人，占比${fmt((v['qrzzk_fk'] || 0) / fk)}%。）。
  `
}

export function getLeaderEduString(o, v, num) {
  return `${o.shortName}领导班子成员研究生${v['yjs'] || 0}人，占比${fmt((v['yjs'] || 0) / num)}%
  （全日制硕士研究生${v['qrzyjs'] || 0}人，占比${fmt((v['qrzyjs'] || 0) / num)}%），
  本科${v['bk'] || 0}人，占比${fmt((v['bk'] || 0) / num)}%（全日制本科学历${v['qrzbk'] || 0}人，占比${fmt((v['qrzbk'] || 0) / num)}%），
  专科${v['zk'] || 0}人，占比${fmt((v['zk'] || 0) / num)}%（全日制专科学历${v['qrzzk'] || 0}人，占比${fmt((v['qrzzk'] || 0) / num)}%）。
  `
}

export function getLeaderPostString(o, v) {
  v = v ?? {}
  return `${o.shortName}副处级领导中任副处级领导岗位低于2年的${v['year1'] || 0}人，大于等于2年的${v['year2'] || 0}人，大于等于5年的${v['year5'] || 0}人，大于等于10年的${v['year10'] || 0}人；
  副处级领导中在副处级领导岗位有1个职位经历的有${v['post1'] || 0}人，2个职位经历的有${v['post2'] || 0}人，3个及以上职位经历的有${v['post3'] || 0}人。
  `
}
