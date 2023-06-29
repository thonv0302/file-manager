const sortBy = ({ _sort, _order }) => {
  const order = {
    asc: 1,
    desc: -1,
  };
  if (_sort && _order) {
    return {
      [_sort]: order[_order],
    };
  }

  return {};
};

module.exports = {
  sortBy,
};
