let arr = [
    "Surrounded",
    "by",
    "nature,",
    "Susan",
    "often",
    "takes",
    "a",
    "stroll,",
    "savoring",
    "the",
    "soothing",
    "sounds",
    "of",
    "chirping",
    "birds.",
    "Such",
    "moments",
    "underline",
    "the",
    "significance",
    "of",
    "embracing",
    "simple",
    "joys",
    "in",
    "life.",
    "Rustlings",
    "in",
    "the",
    "trees",
    "suggest",
    "squirrels",
    "beginning",
    "their",
    "day,",
    "searching",
    "for",
    "sustenance.",
    "Surely,",
    "the",
    "beauty",
    "of",
    "a",
    "sunrise",
    "holds",
    "unparalleled",
    "magic."
  ]


//   let paragraph = "Surrounded by nature, Susan often takes a stroll, savoring the soothing sounds of chirping birds. Such moments underline the significance of embracing simple joys in life. Rustlings in the trees suggest squirrels beginning their day, searching for sustenance. Surely, the beauty of a sunrise holds unparalleled magic.";
//   function findLetter(arr){
//     let count = 0; 
//     let flag = true;
//     for(let i = 0; i < arr.length; i++){
//       if(flag){
//           if(arr[i] === 's' || arr[i] === 'S'){
//               if(arr[i+1] === 'u' || arr[i+1] === 'U'){
//                 console.log(arr[i], arr[i+1]);
//                   count++;
//               }
//           }
//           flag = false;  // move inside
//       }
//       if(arr[i] === '.'){
//         console.log('period found');
//           flag = true;
//       }
//     }
//     return count;
//   }
  
//   console.log(findLetter(paragraph)); // Output: 3
  






let paragraph = "Surrounded by nature, Susan often takes a stroll, savoring the soothing sounds of chirping birds. Such moments underline the significance of embracing simple joys in life. Rustlings in the trees suggest squirrels beginning their day, searching for sustenance. Surely, the beauty of a sunrise holds unparalleled magic.";

// Split the paragraph into words
let words = paragraph.split(/\s+/);



console.log('words', words);

function findSuWords(wordsArr) {
    let count = 0;
    let flag = true;
    for (let i = 0; i < wordsArr.length; i++) {
        // Remove punctuation for checking, but preserve the original word for end-check
        let cleanWord = wordsArr[i].replace(/[^a-zA-Z]/g, '');
        console.log('cleanWord', cleanWord);
        
        if (flag) {
            if (
                cleanWord.length > 1 &&
                (cleanWord[0] === 's' || cleanWord[0] === 'S') &&
                (cleanWord[1] === 'u' || cleanWord[1] === 'U')
            ) {
                count++;
            }
        }
        flag = false;
        if (wordsArr[i].endsWith('.')) {
            flag = true;
        }
    }
    return count;
}

console.log(findSuWords(words)); // Output: 3
