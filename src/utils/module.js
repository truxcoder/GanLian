export function transToTreeData(arr) {
  let tempArray
  let newItem

  const newArray = arr.filter(item => item.rank === 1).map(item => {
    tempArray = arr.filter(i => i.parent === item.id).map(i => { return { id: i.id, label: i.title, icon: i.icon } })
    newItem = { id: item.id, label: item.title, icon: item.icon }
    if (tempArray.length !== 0) {
      newItem.children = [...tempArray]
    }
    return { ...newItem }
  })
  return newArray
}

