/*
 * @Author: truxcoder
 * @Date: 2022-05-12 19:59:08
 * @LastEditTime: 2022-05-12 20:15:03
 * @LastEditors: truxcoder
 * @Description: 教育字典
 */

import { eduDict, degreeDict } from '@/utils/dict'

export const eduOptions = [
  {
    label: '研究生教育',
    value: '研究生教育',
    children: eduDict.filter(i => i.category === 4)
  },
  {
    label: '本科教育',
    value: '本科教育',
    children: eduDict.filter(i => i.category === 3)
  },
  {
    label: '专科教育',
    value: '专科教育',
    children: eduDict.filter(i => i.category === 2)
  },
  ...eduDict.filter(i => i.category === 1)
]

export const degreeOptions = [
  { label: '名誉博士', value: '名誉博士', category: 10 },
  {
    label: '博士学位',
    value: '博士学位',
    children: degreeDict.filter(i => i.category === 3)
  },
  {
    label: '硕士学位',
    value: '硕士学位',
    children: degreeDict.filter(i => i.category === 2)
  },
  {
    label: '学士学位',
    value: '学士学位',
    children: degreeDict.filter(i => i.category === 1)
  }
]
