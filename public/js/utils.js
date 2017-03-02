function yearSort(a,b) {
  if (a.year < b.year)
    return -1;
  if (a.year > b.year)
    return 1;
  return 0;
}

function keySort(a,b) {
  if (a.key < b.key)
    return -1;
  if (a.key > b.key)
    return 1;
  return 0;
}

function keyExists(name, arr) {
    for(var i = 0, len = arr.length; i < len; i++) {
        if( arr[ i ].key === name )
            return i;
    }
    return -1;
}

function upsertArray(key, array) {
  var position = keyExists(key, array) 
  if (position > -1) {
    array[position].count++;
  } else {
    array.push({key: key, count: 1});
  }
}