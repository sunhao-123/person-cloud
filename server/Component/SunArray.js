const SunArray = {
    /**
     * 去重
     * for + obj-keys
     * 单一基础类型最快的
     * @param {*} array
     */
    deduplication: function (array) {
        const result = []
        const tagObj = {}
        for (const i of array) {
            if (!tagObj[i]) {
                result.push(i)
                tagObj[i] = 1
            }
        }
        return result
    },
    unique(arr,attribute){
        var new_arr=[];
        var json_arr=[];
        for(var i=0; i<arr.length; i++){
            if(new_arr.indexOf(arr[i][attribute]) ==-1){    //  -1代表没有找到
                new_arr.push(arr[i][attribute]);   //如果没有找到就把这个name放到arr里面，以便下次循环时用
                json_arr.push(arr[i]);
            } else{
            }
        }
        return json_arr;
    },
    /**
     * 排序
     * @param {*} json
     * @param {*} key
     */
    sort: function (json, key) {
        //console.log(json);
        for (var j = 1, jl = json.length; j < jl; j++) {
            var temp = json[j],
                val = temp[key],
                i = j - 1;
            while (i >= 0 && json[i][key] > val) {
                json[i + 1] = json[i];
                i = i - 1;
            }
            json[i + 1] = temp;

        }
        //console.log(json);
        return json;
    }
}

module.exports = SunArray