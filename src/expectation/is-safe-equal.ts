import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';

function removeUndefined(object:any):any {
  if(Array.isArray(object)){
    return object.map(removeUndefined);
  }

  if(!isObject(object)){
    return object;
  }

  const cleaned:Record<any,any> = {};

  for(const [key, value] of Object.entries(object)){
    if(value !== undefined) {
      cleaned[key] = removeUndefined(value);
    }
  }

  return cleaned;
}

export default function isSafeEqual(a:any, b:any){
  // see https://github.com/NiGhTTraX/strong-mock/issues/252
  return isEqual(removeUndefined(a), removeUndefined(b));
}
