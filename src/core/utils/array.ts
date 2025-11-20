  export const overFlowArrayText = (arr: string[] | undefined, max: number): string => {
	if (arr === undefined) {
	  return "";
	}
  
	const headText = arr.slice(0, max).join('; ');
	const extraCount = arr.length - max;
  
	return extraCount > 0 ? `${headText} +${extraCount}` : headText;
  };
  