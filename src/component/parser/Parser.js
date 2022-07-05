import DxfParser from "dxf-parser";
// import fs from 'fs'
function Parser(file) {
    // debugger;
    const test = () => {
        const parser = new DxfParser();
    }
    // const fileText = file.
    
    try {

        // console.log(file);


        // const fileText = fs.readFileSync(, 'utf8');
        
        // console.log(filetext);
        // const dxf = parser.parse(filetext); // 파라미터가 string 타입이여야 함. 
        // console.log(dxf);
    } catch(err) {
        return console.error(err.stack);
    }
}

export default Parser;
