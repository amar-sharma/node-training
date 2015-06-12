var result = 0;
nums = process.argv;
for (var i = 2; i < nums.length; i++) {
  result += Number(nums[i]);
};
console.log(result);