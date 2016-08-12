/**
 * - Common.js
 * Common functions required in more than one file
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['ko'], function (ko) {

   return {
       /**
        * Generate a GUID
        *
        * @returns {string}
        */
       guid: function () {
           function s4() {
               return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
           }
           return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
       },

       /**
        * Move an array item within an array based on indexes
        *
        * @param array
        * @param fromIndex
        * @param toIndex
        */
       moveArrayItem: function (array, fromIndex, toIndex) {
           // If the array is a KnockoutJS function, retrieve the underlying array
           if (typeof array === 'function') {
               var arrayFn = array;
               array = ko.utils.unwrapObservable(array);

               if (typeof arrayFn.valueWillMutate === 'function') {
                   arrayFn.valueWillMutate()
               }
           }

           var element = array[fromIndex];
           array.splice(fromIndex, 1);
           array.splice(toIndex, 0, element);

           if (typeof arrayFn === 'function') {
               arrayFn(array);
           }

           return array;
       },

       /**
        * Move an item into a different array
        *
        * @param item
        * @param array
        * @param toIndex
        * @returns {*}
        */
       moveArrayItemIntoArray: function (item, array, toIndex) {

           // If the array is a KnockoutJS function, retrieve the underlying array
           if (typeof array === 'function') {
               var arrayFn = array;
               array = ko.utils.unwrapObservable(array);

               if (typeof arrayFn.valueWillMutate === 'function') {
                   arrayFn.valueWillMutate()
               }
           }

           array.splice(toIndex, 0, item);

           if (typeof arrayFn === 'function') {
               arrayFn(array);
           }

           return array;
       }
   }
});