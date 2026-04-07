let arr = [];
let passCount = 0;

function getAlgo() {
  return new URLSearchParams(window.location.search).get("algo");
}

window.onload = () => {
  let algo = getAlgo();
  document.getElementById("title").innerText =
    algo.toUpperCase() + " VISUALIZER";

  showComplexity(algo);
  loadAlgorithmInfo(algo);
};

// Utilities
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getSpeed() {
  return document.getElementById("speed").value;
}

function updateStatus(msg) {
  document.getElementById("status").innerText = "👉 " + msg;
}

function updatePass() {
  document.getElementById("pass").innerText = "Pass: " + passCount;
}

// Complexity
function showComplexity(algo) {
  let text = "";
  if (algo === "bubble") text = "Time: O(n²)";
  if (algo === "selection") text = "Time: O(n²)";
  if (algo === "insertion") text = "Time: O(n²)";
  if (algo === "merge") text = "Time: O(n log n)";
  if (algo === "linear") text = "Time: O(n)";
  if (algo === "binary") text = "Time: O(log n)";
  document.getElementById("complexity").innerText = text;
}

// Generate
function generateArray() {
  arr = document.getElementById("arrayInput").value
    .split(",")
    .map(x => parseInt(x.trim()))
    .filter(x => !isNaN(x));

  render();
  passCount = 0;
  updatePass();
}

// Render
function render() {
  let bars = document.getElementById("bars");
  bars.innerHTML = "";

  arr.forEach(v => {
    let container = document.createElement("div");
    container.className = "bar-container";

    let label = document.createElement("span");
    label.className = "bar-label";
    label.innerText = v;

    let bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = v * 20 + "px";

    container.appendChild(label);
    container.appendChild(bar);
    bars.appendChild(container);
  });
}

function getBars() {
  return document.querySelectorAll(".bar");
}

// Start
function start() {
  let algo = getAlgo();

  if (algo === "bubble") bubbleSort();
  if (algo === "selection") selectionSort();
  if (algo === "insertion") insertionSort();
  if (algo === "merge") mergeSortWrapper();
  if (algo === "linear") linearSearch();
  if (algo === "binary") binarySearch();
}

//////////////// SORTING //////////////////

// Bubble
async function bubbleSort() {
  let bars = getBars();

  for (let i = 0; i < arr.length; i++) {
    passCount++; updatePass();

    for (let j = 0; j < arr.length - i - 1; j++) {

      bars[j].style.background = "red";
      bars[j+1].style.background = "red";

      updateStatus(`Comparing ${arr[j]} and ${arr[j+1]}`);
      await sleep(getSpeed());

      if (arr[j] > arr[j+1]) {
        updateStatus(`Swapping ${arr[j]} and ${arr[j+1]}`);

        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];

        bars[j].style.height = arr[j]*20+"px";
        bars[j].previousElementSibling.innerText = arr[j];

        bars[j+1].style.height = arr[j+1]*20+"px";
        bars[j+1].previousElementSibling.innerText = arr[j+1];
      } else {
        updateStatus(`No swap (${arr[j]} ≤ ${arr[j+1]})`);
      }

      await sleep(getSpeed());
      bars[j].style.background="teal";
      bars[j+1].style.background="teal";
    }

    bars[arr.length-i-1].style.background="green";
  }

  updateStatus("Sorting Completed ✅");
}

// Selection
async function selectionSort() {
  let bars = getBars();

  for (let i=0;i<arr.length;i++) {
    passCount++; updatePass();

    let min=i;
    bars[i].style.background="yellow";

    for (let j=i+1;j<arr.length;j++) {
      bars[j].style.background="red";

      updateStatus(`Comparing ${arr[j]} and ${arr[min]}`);
      await sleep(getSpeed());

      if (arr[j]<arr[min]) min=j;

      bars[j].style.background="teal";
    }

    updateStatus(`Swapping ${arr[i]} and ${arr[min]}`);
    [arr[i],arr[min]]=[arr[min],arr[i]];

    render();
    await sleep(getSpeed());
  }

  updateStatus("Sorting Completed ✅");
}

// Insertion
async function insertionSort() {
  for (let i=1;i<arr.length;i++) {
    passCount++; updatePass();

    let key=arr[i];
    let j=i-1;

    while(j>=0 && arr[j]>key){
      updateStatus(`Shifting ${arr[j]}`);
      arr[j+1]=arr[j];
      j--;

      render();
      await sleep(getSpeed());
    }

    arr[j+1]=key;
    render();
  }

  updateStatus("Sorting Completed ✅");
}

// ✅ Merge Sort Wrapper

async function mergeSortWrapper() {
  passCount = 0;
  updatePass();

  await mergeSort(0, arr.length - 1);

  updateStatus("Sorting Completed ✅");
}

async function mergeSort(l, r) {
  if (l >= r) return;

  updateStatus(`Dividing from index ${l} to ${r}`); // ✅ ADD THIS
  await sleep(getSpeed());

  let m = Math.floor((l + r) / 2);

  await mergeSort(l, m);
  await mergeSort(m + 1, r);

  await merge(l, m, r);
}

async function merge(l, m, r) {

  updateStatus(`Merging from index ${l} to ${r}`); // ✅ ADD THIS
  await sleep(getSpeed());

  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);

  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {

    updateStatus(`Comparing ${left[i]} and ${right[j]}`);
    await sleep(getSpeed());

    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }

    k++;

    render();

    let bars = getBars();
    bars[k - 1].style.background = "red";

    await sleep(getSpeed());
  }

  while (i < left.length) {
    arr[k++] = left[i++];
    render();
    await sleep(getSpeed());
  }

  while (j < right.length) {
    arr[k++] = right[j++];
    render();
    await sleep(getSpeed());
  }

  let bars = getBars();
  for (let x = l; x <= r; x++) {
    bars[x].style.background = "green";
  }

  passCount++;
  updatePass();

  await sleep(getSpeed());
}
//////////////// SEARCH //////////////////

// Linear
async function linearSearch() {
  let target = parseInt(document.getElementById("target").value);
  let bars = getBars();

  for (let i = 0; i < arr.length; i++) {
    bars[i].style.background = "red";
    updateStatus(`Checking ${arr[i]}`);
    await sleep(getSpeed());

    if (arr[i] === target) {
      bars[i].style.background = "green";
      updateStatus(`Found ${target} at index ${i} ✅`);
      return;
    }

    bars[i].style.background = "teal";
  }

  updateStatus(`Element ${target} not found ❌`);
}

// Binary
async function binarySearch(){
  let target = parseInt(document.getElementById("target").value);

  arr.sort((a,b)=>a-b);
  render();

  let l=0,r=arr.length-1;
  let bars=getBars();

  while(l<=r){
    let mid=Math.floor((l+r)/2);

    bars[mid].style.background="red";
    updateStatus(`Checking ${arr[mid]}`);
    await sleep(getSpeed());

    if(arr[mid]===target){
      bars[mid].style.background="green";
      updateStatus(`Found ${target} ✅`);
      return;
    }

    if(arr[mid]<target) l=mid+1;
    else r=mid-1;

    bars[mid].style.background="teal";
  }

  updateStatus(`Element ${target} not found ❌`);
}
//explaination + pseudocode
function loadAlgorithmInfo(algo) {

  let explanation = "";
  let pseudo = "";

  // 🔵 BUBBLE SORT
  if (algo === "bubble") {
    explanation = `
Bubble Sort works by repeatedly comparing adjacent elements.

Step 1: Compare two adjacent elements
Step 2: Swap if they are in wrong order
Step 3: Largest element moves to the end in each pass
Step 4: Repeat for remaining array
`;

    pseudo = `
for i from 0 to n-1:
  for j from 0 to n-i-1:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
`;
  }

  // 🟣 SELECTION SORT
  else if (algo === "selection") {
    explanation = `
Selection Sort selects the minimum element from the unsorted part.

Step 1: Find the smallest element
Step 2: Swap it with the first position
Step 3: Repeat for remaining array
`;

    pseudo = `
for i from 0 to n-1:
  min = i
  for j from i+1 to n:
    if arr[j] < arr[min]:
      min = j
  swap(arr[i], arr[min])
`;
  }

  // 🟡 INSERTION SORT
  else if (algo === "insertion") {
    explanation = `
Insertion Sort builds the sorted array step-by-step.

Step 1: Take one element as key
Step 2: Shift larger elements
Step 3: Insert key at correct position
`;

    pseudo = `
for i from 1 to n:
  key = arr[i]
  j = i-1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j--
  arr[j+1] = key
`;
  }

  // 🟢 MERGE SORT
  else if (algo === "merge") {
    explanation = `
Merge Sort follows Divide and Conquer approach.

Step 1: Divide array into halves
Step 2: Sort both halves
Step 3: Merge them
`;

    pseudo = `
mergeSort(arr):
  if size <= 1: return

  divide array into left & right
  mergeSort(left)
  mergeSort(right)

  merge(left, right)
`;
  }

  // 🔍 LINEAR SEARCH
  else if (algo === "linear") {
    explanation = `
Linear Search checks elements one by one.
`;

    pseudo = `
for i from 0 to n:
  if arr[i] == target:
    return i
return -1
`;
  }

  // 🔎 BINARY SEARCH
  else if (algo === "binary") {
    explanation = `
Binary Search works on sorted arrays.
`;

    pseudo = `
low = 0, high = n-1

while low <= high:
  mid = (low + high) / 2

  if arr[mid] == target:
    return mid
  else if arr[mid] < target:
    low = mid + 1
  else:
    high = mid - 1
`;
  }

  // ✅ APPLY TO UI
  document.getElementById("explanationText").innerText = explanation;
  document.getElementById("pseudoCode").innerText = pseudo;
}
