import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
export default function useDevice() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const smAndSmaller = breakpoints.smaller('md'); // lg and smaller
  return {
    smAndSmaller,
  };
}
