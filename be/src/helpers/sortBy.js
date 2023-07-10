const sortBy = ({ _sort, _order }) => {
  const order = {
    asc: 1,
    desc: -1,
  };
  if (_sort && _order) {
    return {
      isFolder: -1,
      [_sort]: order[_order],
    };
  }

  return {
    isFolder: -1,
    createdAt: -1,
  };
};

module.exports = {
  sortBy,
};
