export const twoSumPlan=`FUNCTION two_sum(nums, target)
CREATE empty map called seen
FOR EACH number AND index IN nums
  SET complement = target - number
  IF seen contains complement
    RETURN matching index, current index
  END IF
  STORE number and index IN seen
END FOR
RETURN empty result
END FUNCTION`;
