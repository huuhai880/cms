const unflatList = (parent_id, list) => {
  let data = list.filter((e) => e.parent_id == parent_id);
  data.forEach((item) => {
    item.children = [];
    item.children = unflatList(item.value, list);
  });
  return data;
};

const checkChildren = (_id, _list) => {
  let isHaveChildren = false;
  const findChildren = (id, list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id && list[i].children.length) {
        isHaveChildren = true;
        break;
      } else if (list[i].id != id && list[i].children.length) {
        findChildren(id, list[i].children);
      }
    }
  };
  findChildren(_id, _list);
  return isHaveChildren;
};

const isHaveChild = (id, list) => {
  let isTrue = false;
  list.forEach((e) => {
    if (e.parent_id === id) isTrue = true;
  });
  return isTrue;
};

module.exports = { unflatList, checkChildren, isHaveChild };
