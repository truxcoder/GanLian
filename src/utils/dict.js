/*
 * @Author: truxcoder
 * @Date: 2021-12-29 09:49:12
 * @LastEditTime: 2022-08-23 09:25:53
 * @LastEditors: truxcoder
 * @Description: 定义各类字典
 */

// import { request } from '@/api/index'
const fullTimeEduDict = []
const partTimeEduDict = []

// request('personnel', 'dict').then(res => {
//   fullTimeEduDict = res.data ? res.data.filter(item => item.category === 1).map(item => item.name) : []
//   partTimeEduDict = res.data ? res.data.filter(item => item.category === 2).map(item => item.name) : []
// })

export const nationDict = [
  '汉族',
  '蒙古族',
  '回族',
  '藏族',
  '维吾尔族',
  '苗族',
  '彝族',
  '壮族',
  '布依族',
  '朝鲜族',
  '满族',
  '侗族',
  '瑶族',
  '白族',
  '土家族',
  '哈尼族',
  '哈萨克族',
  '傣族',
  '黎族',
  '僳僳族',
  '佤族',
  '畲族',
  '高山族',
  '拉祜族',
  '水族',
  '东乡族',
  '纳西族',
  '景颇族',
  '柯尔克孜族',
  '土族',
  '达斡尔族',
  '仫佬族',
  '羌族',
  '布朗族',
  '撒拉族',
  '毛南族',
  '仡佬族',
  '锡伯族',
  '阿昌族',
  '普米族',
  '塔吉克族',
  '怒族',
  '乌孜别克族',
  '俄罗斯族',
  '鄂温克族',
  '德昂族',
  '保安族',
  '裕固族',
  '京族',
  '塔塔尔族',
  '独龙族',
  '鄂伦春族',
  '赫哲族',
  '门巴族',
  '珞巴族',
  '基诺族'
]

export const politicalDict = ['中共党员', '中共预备党员', '共青团员', '群众']
export const proCertDict = [
  '教师资格证',
  '法律职业资格证',
  '中国委托公证人资格证(香港、澳门)',
  '注册会计师证',
  '注册城乡规划师证',
  '注册测绘师证',
  '民用核安全设备无损检验人员证',
  '国防科技工业军用核安全设备无损检验人员证',
  '民用核设施操纵人员证',
  '国防科技工业军用核设施操纵人员证',
  '注册核安全工程师证',
  '注册建筑师证',
  '监理工程师证',
  '房地产估价师证',
  '造价工程师证',
  '建造师证',
  '注册结构工程师证',
  '注册土木工程师证',
  '注册化工工程师证',
  '注册电气工程师证',
  '注册公用设备工程师证',
  '注册环保工程师证',
  '注册验船师证',
  '船员资格证(含船员、渔业船员)',
  '执业兽医证',
  '演出经纪人员资格证',
  '导游资格证',
  '医师证',
  '乡村医生证',
  '人体器官移植医师证',
  '职业病诊断医师证',
  '护士执业资格证',
  '母婴保健技术服务人员资格证',
  '注册安全工程师证',
  '注册消防工程师证',
  '注册计量师证',
  '特种设备检验、检测人员资格证',
  '广播电视主持人资格证',
  '广播电视播音员资格证',
  '新闻记者职业资格证',
  '地面人员证',
  '空勤人员证',
  '民用航空器外国驾驶员证',
  '领航员证',
  '飞行机械员证',
  '飞行通信员证',
  '航空安全员证',
  '民用航空电信人员证',
  '航行情报人员证',
  '气象人员证',
  '执业药师证',
  '专利代理人证',
  '拍卖师证',
  '工程咨询(投资)专业技术人员职业资格证',
  '通信专业技术人员职业资格证',
  '计算机技术与软件专业技术资格证',
  '社会工作者职业资格证',
  '会计专业技术资格证',
  '资产评估师证',
  '经济专业技术资格证',
  '不动产登记代理专业人员职业资格证',
  '矿业权评估师证',
  '环境影响评价工程师证',
  '房地产经纪专业人员职业资格证',
  '机动车检测维修专业技术人员职业资格证',
  '公路水运工程试验检测专业技术人员职业资格证',
  '水利工程质量检测员资格证',
  '卫生专业技术资格证',
  '审计专业技术资格证',
  '税务师证',
  '认证人员职业资格证',
  '设备监理师证',
  '统计专业技术资格证',
  '出版专业技术人员职业资格证',
  '银行业专业人员职业资格证',
  '证券期货业从业人员资格证',
  '文物保护工程从业资格证',
  '翻译专业资格证',
  '精算师证',
  '民用核安全设备焊工证',
  '民用核安全设备焊接操作工证',
  '国防科技工业军用核安全设备焊接人员证',
  '保安员证',
  '民航安全检查员证',
  '消防员证',
  '森林消防员证',
  '应急救援员证',
  '消防设施操作员证',
  '游泳救生员证',
  '社会体育指导员证',
  '民航乘务员证',
  '机场运行指挥员证',
  '轨道列车司机证',
  '危险货物道路运输从业人员证',
  '放射性物品道路运输从业人员证',
  '危险货物水路运输从业人员证',
  '经营性客运驾驶员证',
  '经营性货运驾驶员证',
  '出租汽车驾驶员证',
  '特种作业人员证',
  '建筑施工特种作业人员证',
  '特种设备安全管理和作业人员证',
  '家畜繁殖员证'
]
// export const fullTimeEduDict = ['博士研究生', '硕士研究生', '博士', '硕士', '大学本科学士', '大学本科', '大学专科', '中专', '中技', '高中', '初中']
export { fullTimeEduDict, partTimeEduDict }
// export const partTimeEduDict = [
//   '在职博士研究生',
//   '在职硕士研究生',
//   '在职大学',
//   '在职大专',
//   '成人教育大学',
//   '成人教育大专',
//   '省委党校硕士研究生',
//   '省委党校大学',
//   '省委党校大专',
//   '中央党校博士研究生',
//   '中央党校硕士研究生',
//   '中央党校大学'
// ]

export const marriageDict = ['未婚', '已婚', '再婚', '离异', '丧偶']

export const eduDict = [
  { label: '研究生', value: '研究生', category: 4 },
  { label: '研究生班', value: '研究生班', category: 4 },
  { label: '中央党校研究生', value: '中央党校研究生', category: 4 },
  { label: '省（区、市）委党校研究生', value: '省（区、市）委党校研究生', category: 4 },
  { label: '大学', value: '大学', category: 3 },
  { label: '中央党校大学', value: '中央党校大学', category: 3 },
  { label: '省（区、市）委党校大学', value: '省（区、市）委党校大学', category: 3 },
  { label: '大专', value: '大专', category: 2 },
  { label: '省（区、市）委党校大专', value: '省（区、市）委党校大专', category: 2 },
  { label: '大学普通班', value: '大学普通班', category: 2 },
  { label: '中央党校大专', value: '中央党校大专', category: 2 },
  { label: '中专', value: '中专', category: 1 },
  { label: '中技', value: '中技', category: 1 },
  { label: '高中', value: '高中', category: 1 },
  { label: '初中', value: '初中', category: 1 },
  { label: '小学', value: '小学', category: 1 }
]

export const degreeDict = [
  { label: '名誉博士', value: '名誉博士', category: 10 },
  { label: '哲学博士', value: '哲学博士', category: 3 },
  { label: '经济学博士', value: '经济学博士', category: 3 },
  { label: '法学博士', value: '法学博士', category: 3 },
  { label: '教育学博士', value: '教育学博士', category: 3 },
  { label: '文学博士', value: '文学博士', category: 3 },
  { label: '历史学博士', value: '历史学博士', category: 3 },
  { label: '理学博士', value: '理学博士', category: 3 },
  { label: '工学博士', value: '工学博士', category: 3 },
  { label: '农学博士', value: '农学博士', category: 3 },
  { label: '医学博士', value: '医学博士', category: 3 },
  { label: '军事学博士', value: '军事学博士', category: 3 },
  { label: '管理学博士', value: '管理学博士', category: 3 },
  { label: '临床医学博士专业', value: '临床医学博士专业', category: 3 },
  { label: '兽医博士专业', value: '兽医博士专业', category: 3 },
  { label: '口腔医学博士专业', value: '口腔医学博士专业', category: 3 },
  { label: '哲学硕士', value: '哲学硕士', category: 2 },
  { label: '经济学硕士', value: '经济学硕士', category: 2 },
  { label: '法学硕士', value: '法学硕士', category: 2 },
  { label: '教育学硕士', value: '教育学硕士', category: 2 },
  { label: '文学硕士', value: '文学硕士', category: 2 },
  { label: '历史学硕士', value: '历史学硕士', category: 2 },
  { label: '理学硕士', value: '理学硕士', category: 2 },
  { label: '工学硕士', value: '工学硕士', category: 2 },
  { label: '农学硕士', value: '农学硕士', category: 2 },
  { label: '医学硕士', value: '医学硕士', category: 2 },
  { label: '军事学硕士', value: '军事学硕士', category: 2 },
  { label: '管理学硕士', value: '管理学硕士', category: 2 },
  { label: '法律硕士专业', value: '法律硕士专业', category: 2 },
  { label: '教育硕士专业', value: '教育硕士专业', category: 2 },
  { label: '工程硕士专业', value: '工程硕士专业', category: 2 },
  { label: '建筑学硕士专业', value: '建筑学硕士专业', category: 2 },
  { label: '临床医学硕士专业', value: '临床医学硕士专业', category: 2 },
  { label: '工商管理硕士专业', value: '工商管理硕士专业', category: 2 },
  { label: '农业推广硕士专业', value: '农业推广硕士专业', category: 2 },
  { label: '兽医硕士专业', value: '兽医硕士专业', category: 2 },
  { label: '公共管理硕士专业', value: '公共管理硕士专业', category: 2 },
  { label: '口腔医学硕士专业', value: '口腔医学硕士专业', category: 2 },
  { label: '公共卫生硕士专业', value: '公共卫生硕士专业', category: 2 },
  { label: '军士硕士专业', value: '军士硕士专业', category: 2 },
  { label: '哲学学士', value: '哲学学士', category: 1 },
  { label: '经济学学士', value: '经济学学士', category: 1 },
  { label: '法学学士', value: '法学学士', category: 1 },
  { label: '教育学学士', value: '教育学学士', category: 1 },
  { label: '文学学士', value: '文学学士', category: 1 },
  { label: '历史学学士', value: '历史学学士', category: 1 },
  { label: '理学学士', value: '理学学士', category: 1 },
  { label: '工学学士', value: '工学学士', category: 1 },
  { label: '农学学士', value: '农学学士', category: 1 },
  { label: '医学学士', value: '医学学士', category: 1 },
  { label: '军事学学士', value: '军事学学士', category: 1 },
  { label: '管理学学士', value: '管理学学士', category: 1 },
  { label: '艺术学学士', value: '艺术学学士', category: 1 }, // 此项在干免表编辑器里不存在，系另增加的选项
  { label: '建筑学学士专业', value: '建筑学学士专业', category: 1 }
]

export const conclusionDict = [
  { value: '优秀', category: 1 },
  { value: '称职', category: 1 },
  { value: '基本称职', category: 1 },
  { value: '不称职', category: 1 },
  { value: '不确定等次', category: 1 },
  { value: '不进行考核', category: 1 },
  { value: '好', category: 2 },
  { value: '较好', category: 2 },
  { value: '一般', category: 2 },
  { value: '较差', category: 2 },
  { value: '不确定等次', category: 2 }
]
export const aimDict = ['出差', '旅行', '学习', '探亲']
// export const relationDict = ['妻子', '丈夫', '父亲', '母亲', '儿子', '女儿', '养父', '养母', '养子', '养女', '继父', '继母', '继子', '继女', '长子', '次子', '三子', '四子', '五子', '长女', '次女', '三女', '四女', '五女']
export const relationDict = [
  { label: '妻子', value: '妻子', sort: 1 },
  { label: '丈夫', value: '丈夫', sort: 2 },
  { label: '儿子', value: '儿子', sort: 7 },
  { label: '女儿', value: '女儿', sort: 8 },
  { label: '长子', value: '长子', sort: 11 },
  { label: '次子', value: '次子', sort: 12 },
  { label: '三子', value: '三子', sort: 13 },
  { label: '四子', value: '四子', sort: 14 },
  { label: '五子', value: '五子', sort: 15 },
  { label: '六子', value: '六子', sort: 16 },
  { label: '七子', value: '七子', sort: 17 },
  { label: '八子', value: '八子', sort: 18 },
  { label: '九子', value: '九子', sort: 19 },
  { label: '长女', value: '长女', sort: 21 },
  { label: '次女', value: '次女', sort: 22 },
  { label: '三女', value: '三女', sort: 23 },
  { label: '四女', value: '四女', sort: 24 },
  { label: '五女', value: '五女', sort: 25 },
  { label: '六女', value: '六女', sort: 26 },
  { label: '七女', value: '七女', sort: 27 },
  { label: '八女', value: '八女', sort: 28 },
  { label: '九女', value: '九女', sort: 29 },
  { label: '养子', value: '养子', sort: 31 },
  { label: '养女', value: '养女', sort: 32 },
  { label: '继子', value: '继子', sort: 33 },
  { label: '继女', value: '继女', sort: 34 },
  { label: '父亲', value: '父亲', sort: 40 },
  { label: '母亲', value: '母亲', sort: 41 },
  { label: '养父', value: '养父', sort: 42 },
  { label: '养母', value: '养母', sort: 43 },
  { label: '继父', value: '继父', sort: 44 },
  { label: '继母', value: '继母', sort: 45 },
  { label: '岳父', value: '岳父', sort: 46 },
  { label: '岳母', value: '岳母', sort: 47 },
  { label: '公公', value: '公公', sort: 48 },
  { label: '婆婆', value: '婆婆', sort: 49 },
  { label: '哥哥', value: '哥哥', sort: 50 },
  { label: '姐姐', value: '姐姐', sort: 51 },
  { label: '弟弟', value: '弟弟', sort: 52 },
  { label: '妹妹', value: '妹妹', sort: 53 }
]
export const seasonDict = [
  { label: '年终', value: 100 },
  { label: '一季度', value: 101 },
  { label: '二季度', value: 102 },
  { label: '三季度', value: 103 },
  { label: '四季度', value: 104 },
  { label: '一月', value: 1 },
  { label: '二月', value: 2 },
  { label: '三月', value: 3 },
  { label: '四月', value: 4 },
  { label: '五月', value: 5 },
  { label: '六月', value: 6 },
  { label: '七月', value: 7 },
  { label: '八月', value: 8 },
  { label: '九月', value: 9 },
  { label: '十月', value: 10 },
  { label: '十一月', value: 11 },
  { label: '十二月', value: 12 }
]
export const awardCategory = [
  { label: '年度奖励', value: 1 },
  { label: '专项表彰', value: 2 }
]
export const awardGrade = [
  { label: '授予称号', value: 1, category: 1 },
  { label: '一等功', value: 2, category: 1 },
  { label: '二等功', value: 3, category: 1 },
  { label: '三等功', value: 4, category: 1 },
  { label: '嘉奖', value: 5, category: 1 },
  { label: '国家级', value: 20, category: 2 },
  { label: '省部级', value: 21, category: 2 },
  { label: '市厅级', value: 22, category: 2 },
  { label: '局级', value: 23, category: 2 },
  { label: '所级', value: 24, category: 2 }
]
export const punishCategory = [
  { label: '组织处理', value: 1 },
  { label: '组织教育', value: 2 }
]
export const punishGrade = [
  { label: '停职检查', value: 1, category: 1 },
  { label: '调整职务', value: 2, category: 1 },
  { label: '责令辞职', value: 3, category: 1 },
  { label: '降职', value: 4, category: 1 },
  { label: '免职', value: 5, category: 1 },
  { label: '责令检查', value: 20, category: 2 },
  { label: '批评教育', value: 21, category: 2 },
  { label: '诫勉', value: 22, category: 2 },
  { label: '提醒', value: 23, category: 2 }
]
export const eduCategory = [
  { label: '全日制', value: 1 },
  { label: '非全日制', value: 2 }
]
export const passportDict = [
  { label: '无', value: 0 },
  { label: '护照', value: 1 },
  { label: '港澳通行证', value: 2 },
  { label: '台湾通行证', value: 3 }
]
export const permissionDict = {
  ADD: '添加数据',
  DELETE: '删除数据',
  UPDATE: '修改数据',
  READ: '查看数据',
  MANAGE: '管理数据',
  MENU: '进入菜单',
  GLOBAL: '全局数据',
  SPECIAL: '特殊权限'
}
export const affairCategoryDict = ['未定义', '经济责任审计情况', '个人事项核查情况', '检查巡视巡查']
export const oldDepartmentDict = [
  '安全生产科',
  '八大队',
  '办公室',
  '办公室(科技信息科)',
  '财务科',
  '党群科(工会办)',
  '二大队',
  '工会办',
  '管理科',
  '规划财务科',
  '后勤保障大队',
  '基建大队(十一大队)',
  '纪委办、监察科(合署办公)',
  '监察科(与纪委合署办公)',
  '监察审计科',
  '监审督查科',
  '教育矫正中心',
  '教育矫治科',
  '教育科',
  '戒毒医疗中心',
  '戒毒执行科',
  '警戒护卫大队',
  '警戒科',
  '警戒科(护卫队)',
  '警务督察科',
  '九大队',
  '康复训练中心',
  '离退休管理科',
  '离退休人员管理科',
  '六大队',
  '七大队',
  '勤务大队',
  '人事警务科',
  '三大队',
  '审计科',
  '生产规划科',
  '生产科',
  '生活卫生科',
  '十八大队',
  '十大队',
  '十二大队',
  '十六大队',
  '十七大队',
  '十三大队',
  '十四大队',
  '十五大队',
  '十五大队(戒毒康复就业职培中心)',
  '十一大队',
  '四大队',
  '所政管理科',
  '五大队',
  '心理矫治中心',
  '研究室',
  '一大队',
  '医疗康复科',
  '医院',
  '应急指挥中心大队',
  '诊断评估中心',
  '政治处',
  '组织宣传科'
]

export const reviewCategoryDict = [
  { label: '人员基本信息', value: 1 },
  { label: '教育情况', value: 2 },
  { label: '个人简历', value: 3 },
  { label: '家庭成员', value: 4 }
]
export const incorruptionReviewCategoryDict = [
  { label: '处分数据', value: 101 },
  { label: '信访举报', value: 102 },
  { label: '经济责任审计', value: 103 },
  { label: '个人事项核查', value: 104 },
  { label: '检查巡视巡查', value: 105 }
]
export const reviewStatusDict = [
  { label: '待审核', value: 1 },
  { label: '审核通过', value: 2 },
  { label: '审核不通过', value: -1 }
]
export const feedbackCategoryDict = [
  { label: '个人信息', value: 1 }
]
export const feedbackStatusDict = [
  { label: '待审核', value: 1 },
  { label: '已处理', value: 2 },
  { label: '不处理', value: -1 }
]

export const trainingMethodDict = [
  { label: '委托培训', value: 1, parent: 0 },
  { label: '自主培训', value: 2, parent: 0 },
  { label: '线上', value: 11, parent: 1 },
  { label: '线下', value: 12, parent: 1 },
  { label: '统一视频', value: 111, parent: 11 },
  { label: '自学视频', value: 112, parent: 11 }
]

export const trainingCategoryDict = [
  { label: '政治理论培训', value: 1, parent: 0 },
  { label: '领导干部任职培训', value: 2, parent: 0 },
  { label: '公务员初任培训', value: 3, parent: 0 },
  { label: '在职培训', value: 4, parent: 0 },
  { label: '专业资格继续教育培训', value: 5, parent: 0 },
  { label: '警衔评授培训', value: 6, parent: 0 },
  { label: '警体培训', value: 7, parent: 0 },
  { label: '应急处突培训', value: 8, parent: 0 },
  { label: '岗位比武', value: 9, parent: 0 },
  { label: '其他培训', value: 10, parent: 0 },
  { label: '处级领导', value: 21, parent: 2 },
  { label: '科级领导', value: 22, parent: 2 },
  { label: '首次授予警衔培训', value: 61, parent: 6 },
  { label: '警衔晋升培训', value: 62, parent: 6 }
]

export const trainingMethodOption = [
  {
    label: '委托培训',
    value: 1,
    children: [
      {
        label: '线上',
        value: 11,
        children: [
          { label: '统一视频', value: 111 },
          { label: '自学视频', value: 112 }
        ]
      },
      { label: '线下', value: 12 }
    ]
  },
  { label: '自主培训', value: 2 }
]

// export const trainingCategoryOption = [
//   { label: '政治理论培训', value: 1 },
//   {
//     label: '领导干部任职培训',
//     value: 2,
//     children: [
//       { label: '处级领导', value: 21 },
//       { label: '科级领导', value: 22 }
//     ]
//   },
//   { label: '公务员初任培训', value: 3 },
//   { label: '在职培训', value: 4 },
//   { label: '专业资格继续教育培训', value: 5 }
// ]

export const trainingCategoryOption = trainingCategoryDict.filter(i => i.parent === 0).map(i => {
  const children = trainingCategoryDict.filter(item => item.parent === i.value)
  if (children.length !== 0) {
    i.children = children
  }
  return i
})
