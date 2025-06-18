/**
 * QuickSort Algorithm Implementation in JavaScript
 *
 * QuickSort is a divide-and-conquer algorithm that works by selecting a 'pivot' element
 * from the array and partitioning the other elements into two sub-arrays according to
 * whether they are less than or greater than the pivot.
 *
 * Time Complexity:
 * - Best Case: O(n log n)
 * - Average Case: O(n log n)
 * - Worst Case: O(n²) - when the pivot is always the smallest or largest element
 *
 * Space Complexity: O(log n) - due to recursion stack
 */

/**
 * Basic QuickSort implementation (in-place sorting)
 * @param {number[]} arr - Array to be sorted
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, low, high);

    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

/**
 * Partition function using Lomuto partition scheme
 * @param {number[]} arr - Array to partition
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number} - Pivot index after partitioning
 */
function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];

  // Index of smaller element (indicates right position of pivot)
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++;
      swap(arr, i, j);
    }
  }

  // Place pivot in correct position
  swap(arr, i + 1, high);
  return i + 1;
}

/**
 * Alternative partition function using Hoare partition scheme
 * More efficient than Lomuto scheme
 * @param {number[]} arr - Array to partition
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number} - Pivot index after partitioning
 */
function hoarePartition(arr, low, high) {
  const pivot = arr[low];
  let i = low - 1;
  let j = high + 1;

  while (true) {
    do {
      i++;
    } while (arr[i] < pivot);

    do {
      j--;
    } while (arr[j] > pivot);

    if (i >= j) {
      return j;
    }

    swap(arr, i, j);
  }
}

/**
 * QuickSort with random pivot selection to avoid worst-case scenarios
 * @param {number[]} arr - Array to be sorted
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array
 */
function randomizedQuickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Randomly select pivot and swap with last element
    const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    swap(arr, randomIndex, high);

    const pivotIndex = partition(arr, low, high);

    randomizedQuickSort(arr, low, pivotIndex - 1);
    randomizedQuickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

/**
 * QuickSort with median-of-three pivot selection
 * @param {number[]} arr - Array to be sorted
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array
 */
function medianOfThreeQuickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Use median-of-three as pivot
    const pivotIndex = medianOfThree(arr, low, high);
    swap(arr, pivotIndex, high);

    const newPivotIndex = partition(arr, low, high);

    medianOfThreeQuickSort(arr, low, newPivotIndex - 1);
    medianOfThreeQuickSort(arr, newPivotIndex + 1, high);
  }
  return arr;
}

/**
 * Find median of three elements (first, middle, last)
 * @param {number[]} arr - Array
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number} - Index of median element
 */
function medianOfThree(arr, low, high) {
  const mid = Math.floor((low + high) / 2);

  if (arr[mid] < arr[low]) {
    swap(arr, low, mid);
  }
  if (arr[high] < arr[low]) {
    swap(arr, low, high);
  }
  if (arr[high] < arr[mid]) {
    swap(arr, mid, high);
  }

  return mid;
}

/**
 * Iterative QuickSort implementation (avoids recursion stack overflow)
 * @param {number[]} arr - Array to be sorted
 * @returns {number[]} - Sorted array
 */
function iterativeQuickSort(arr) {
  const stack = [];
  stack.push(0);
  stack.push(arr.length - 1);

  while (stack.length > 0) {
    const high = stack.pop();
    const low = stack.pop();

    if (low < high) {
      const pivotIndex = partition(arr, low, high);

      // Push left subarray bounds
      stack.push(low);
      stack.push(pivotIndex - 1);

      // Push right subarray bounds
      stack.push(pivotIndex + 1);
      stack.push(high);
    }
  }

  return arr;
}

/**
 * QuickSort for arrays with duplicate elements (3-way partitioning)
 * @param {number[]} arr - Array to be sorted
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - Sorted array
 */
function threeWayQuickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const [lt, gt] = threeWayPartition(arr, low, high);

    threeWayQuickSort(arr, low, lt - 1);
    threeWayQuickSort(arr, gt + 1, high);
  }
  return arr;
}

/**
 * Three-way partitioning for handling duplicates efficiently
 * @param {number[]} arr - Array to partition
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - [lt, gt] indices
 */
function threeWayPartition(arr, low, high) {
  const pivot = arr[low];
  let lt = low; // arr[low..lt-1] < pivot
  let i = low + 1; // arr[lt..i-1] == pivot
  let gt = high; // arr[gt+1..high] > pivot

  while (i <= gt) {
    if (arr[i] < pivot) {
      swap(arr, lt++, i++);
    } else if (arr[i] > pivot) {
      swap(arr, i, gt--);
    } else {
      i++;
    }
  }

  return [lt, gt];
}

/**
 * Utility function to swap two elements in an array
 * @param {number[]} arr - Array
 * @param {number} i - First index
 * @param {number} j - Second index
 */
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

/**
 * Utility function to check if array is sorted
 * @param {number[]} arr - Array to check
 * @returns {boolean} - True if sorted, false otherwise
 */
function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Benchmark function to compare different QuickSort implementations
 * @param {number[]} arr - Array to sort
 * @param {Function} sortFunction - Sorting function to benchmark
 * @param {string} name - Name of the sorting algorithm
 * @returns {object} - Benchmark results
 */
function benchmarkSort(arr, sortFunction, name) {
  const testArr = [...arr]; // Create a copy
  const startTime = performance.now();

  sortFunction(testArr);

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return {
    algorithm: name,
    executionTime: `${executionTime.toFixed(4)}ms`,
    isSorted: isSorted(testArr),
    arrayLength: arr.length,
  };
}

// Export all functions
export {
  benchmarkSort,
  hoarePartition,
  isSorted,
  iterativeQuickSort,
  medianOfThreeQuickSort,
  partition,
  quickSort,
  randomizedQuickSort,
  swap,
  threeWayQuickSort,
};

// Example usage and demonstrations
if (typeof window === 'undefined' && typeof module !== 'undefined') {
  // Node.js environment - run examples
  console.log('QuickSort Algorithm Demonstrations:\n');

  // Test arrays
  const testArrays = [
    [64, 34, 25, 12, 22, 11, 90],
    [5, 2, 8, 1, 9, 3, 7, 4, 6],
    [1, 1, 1, 1, 1], // Duplicates
    [5, 4, 3, 2, 1], // Reverse sorted
    [1, 2, 3, 4, 5], // Already sorted
    [], // Empty array
  ];

  testArrays.forEach((arr, index) => {
    console.log(`Test ${index + 1}: [${arr.join(', ')}]`);

    // Test basic quicksort
    const sortedBasic = quickSort([...arr]);
    console.log(`Basic QuickSort: [${sortedBasic.join(', ')}]`);

    // Test randomized quicksort
    const sortedRandom = randomizedQuickSort([...arr]);
    console.log(`Randomized QuickSort: [${sortedRandom.join(', ')}]`);

    // Test three-way quicksort
    const sortedThreeWay = threeWayQuickSort([...arr]);
    console.log(`Three-Way QuickSort: [${sortedThreeWay.join(', ')}]`);

    console.log('---');
  });
}
