/*
 * @Author: truxcoder
 * @Date: 2021-10-12 17:02:21
 * @LastEditTime: 2021-12-21 13:21:13
 * @LastEditors: truxcoder
 * @Description:
 */
export function transToTreeData(arr) {
  let tempArray
  let newItem

  const newArray = arr
    .filter(item => item.rank === 1)
    .map(item => {
      tempArray = arr
        .filter(i => i.parent === item.id)
        .map(i => {
          return { id: i.id, label: i.title, name: i.name, icon: i.icon }
        })
      newItem = { id: item.id, label: item.title, name: item.name, icon: item.icon }
      if (tempArray.length !== 0) {
        newItem.children = [...tempArray]
      }
      return { ...newItem }
    })
  return newArray
}
