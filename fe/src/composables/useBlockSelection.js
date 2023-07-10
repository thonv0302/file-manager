import { reactive } from 'vue';

let blockSet = new Set();

export const useBlockSelection = function () {
  const blocks = reactive(blockSet);

  const clear = () => {
    blocks.clear();
  };
  const toggle = (id) => {
    if (blocks.has(id)) {
      blocks.delete(id);
    } else {
      blocks.add(id);
    }
  };

  const addOne = (id) => {
    clear();
    blocks.add(id);
  };

  return {
    blocks,
    toggle,
    addOne,
    clear,
  };
};

export default useBlockSelection;
