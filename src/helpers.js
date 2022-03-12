import { Wallet } from "ethers";
import moment from 'moment';

export function privateKeyToWallet(key, web3) {
   const wallet = new Wallet(key, web3);
   
   return wallet;   
}

export function convertBytes(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes === 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function convertBytestoMB(bytes) {
   if (bytes === 0) return 0;
   return Math.round(bytes / Math.pow(1024, 2), 2);
}

export function convertGBtoMB(bytes) {
   if (bytes === 0) return 0;
   return (bytes * 1024);
}

export const myColor = "#3f51b5";

const convertToCSV = (objArray) => {
   let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
   let str = '';
 
   for (let i = 0; i < array.length; i++) {
     let line = '';
     for (let index in array[i]) {
       if (line !== '') line += ','
       line += array[i][index];
     }
     str += line + '\r\n';
   }
   return str;
 }

 const exportCSVFile = (headers, items, fileTitle) => {
   if (headers) {
     items.unshift(headers);
   }
   // Convert Object to JSON
   let jsonObject = JSON.stringify(items);
 
   let csv = convertToCSV(jsonObject);
 
   let exportedFilenmae = fileTitle + '.csv' || 'export.csv';
 
   let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
   if (navigator.msSaveBlob) { // IE 10+
       navigator.msSaveBlob(blob, exportedFilenmae);
   } else {
     let link = document.createElement("a");
     if (link.download !== undefined) { // feature detection
       // Browsers that support HTML5 download attribute
       let url = URL.createObjectURL(blob);
       link.setAttribute("href", url);
       link.setAttribute("download", exportedFilenmae);
       link.style.visibility = 'hidden';
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
     }
   }
}

// Complete this
export const downloadCSV = (arr, fileTitle) => {
  let itemsFormatted = [];
  let headers = {};

  // format the data
  if(fileTitle === 'Books') {
   headers = {
      book_id: 'Book Id',
      book_title: 'Title',
      book_author: 'Author',
      book_dateAdded: 'Date Added',
      book_eBook: 'eBook?',
      book_totalStock: 'Stock Count',
      book_availableStock: 'Available Stock',
      book_avgRating: 'Rating',
   };
   arr.forEach((item) => {
      itemsFormatted.push({
         book_id: parseInt(item.bookId),
         book_title: item.title.replace(/,/g, ''),
         book_author: item.author.replace(/,/g, ''),
         book_dateAdded: moment.unix(item.dateAdded).format('h:mm:ss A M/D/Y'),
         book_eBook: item.eBookAvailable,
         book_totalStock: parseInt(item.totalStock),
         book_availableStock: parseInt(item.availableStock),
         book_avgRating: parseInt(item.avgRating),
      });
   });
  }
  else if(fileTitle === 'Users') {
   headers = {
      user_id: 'User Id',
      user_name: 'Name',
      user_email: 'Email',
      user_dateAdded: 'Date Added',
      user_isMember: 'isMember?',
   };
   arr.forEach((item) => {
      itemsFormatted.push({
         user_id: parseInt(item.userId),
         user_name: item.name.replace(/,/g, ''),
         user_email: item.email.replace(/,/g, ''),
         user_dateAdded: moment.unix(item.dateAdded).format('h:mm:ss A M/D/Y'),
         user_isMember: item.isMember,
      });
   });
  }
  else if(fileTitle === 'Transactions') {
   headers = {
      book_id: 'Book Id',
      borrower: 'Address',
      timestamp: 'Time',
   };
   arr.forEach((item) => {
      itemsFormatted.push({
         book_id: parseInt(item.bookId),
         borrower: item.borrower,
         timestamp: moment.unix(item.timestamp).format('h:mm:ss A M/D/Y'),
      });
   });
  }

  exportCSVFile(headers, itemsFormatted, fileTitle);
};