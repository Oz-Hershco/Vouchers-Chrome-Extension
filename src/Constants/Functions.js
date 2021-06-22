const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

const getURL = (file) => {
    var result;
    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            result = e.target.result;
        }

        reader.readAsDataURL(file); // convert to base64 string
    }
    return result;
}

const groupBy = (arr, property) => {
    return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
}

const sumByObjectField = (key, array) => {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
}


export {
    b64toBlob,
    getURL,
    groupBy,
    sumByObjectField
}