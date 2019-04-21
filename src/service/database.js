class Database{
    static push(key,value){
        let table=this.get(key);
        if (table===null){
            table=[];
        }
        table.push(value);
        localStorage.setItem(key,JSON.stringify(table))
        console.log("table",table)
    }
    static set(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    }
    static get(key){
        return JSON.parse(localStorage.getItem(key));
    }
    static remove(key){
        localStorage.removeItem(key);
    }
    static clear(){
        localStorage.clear();
    }
}

export default Database;