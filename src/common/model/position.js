const YesOrNo = [ { label:'是', value: true }, { label:'否', value: false } ]
const ChiefOrVice = [ { label:'正职', value: true }, { label:'副职', value: false } ]
export default {
  name: { type: 'STRING', label: '名称', order: 1 },
  isLeader: { type: 'SELECT', label: '是否为领导职务', order: 2, options: YesOrNo },
  isChief: { type: 'SELECT', label: '性质', order: 3, options: ChiefOrVice },
  levelId: { type: 'STRING', label: '级别', order: 4 },
}
