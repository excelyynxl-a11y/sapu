from typing import TypeVar, Generic
from entry_block import SENTINEL, EntryBlock
from datetime import date 

T = TypeVar('T')

class ArraySortedList(Generic[T]):
    """
    Sorted list that stores EntryBlock items in ascending order by date.
    Has a pointer meant to be 'moved' during k-sort merge process.
    """

    def __init__(self) -> None:
        self.__array = []
        self.__length = 0
        self.__pointer = 0

    def add(self, item: T) -> None:
        """
        Insert item in sorted order.
        """
        index = self.__index_to_add(item) # O(logN)
        self.__shuffle_right(index) # O(N)
        self.__array[index] = item
        self.__length += 1

    def add_sentinel(self) -> None:
        """
        Append the SENTINEL EntryBlock as the last element.
        """
        self.__array.append(SENTINEL)
        self.__length += 1

    def delete_at_index(self, index: int) -> T:
        """
        Delete and return item at the given position.
        """
        item = self[index]
        self.__shuffle_left(index) # O(N)
        self.__length -= 1
        return item

    def increment_pointer(self) -> None:
        """
        Move the pointer forward by one.
        """
        self.__pointer += 1

    def peek_pointer(self) -> T:
        """
        Return the EntryBlock at the current pointer position.
        Returns SENTINEL if pointer is past the last element.
        """
        if self.__pointer >= self.__length:
            return SENTINEL
        return self.__array[self.__pointer]

    def reset_pointer(self) -> None:
        """
        Reset pointer to the first element.
        """
        self.__pointer = 0

    def __lt__(self, other: 'ArraySortedList') -> bool:
        return self.peek_pointer() < other.peek_pointer()

    def __le__(self, other: 'ArraySortedList') -> bool:
        return self.peek_pointer() <= other.peek_pointer()

    def __gt__(self, other: 'ArraySortedList') -> bool:
        return self.peek_pointer() > other.peek_pointer()

    def __ge__(self, other: 'ArraySortedList') -> bool:
        return self.peek_pointer() >= other.peek_pointer()

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, ArraySortedList):
            return NotImplemented
        return self.peek_pointer() == other.peek_pointer()

    def index(self, item: T) -> int:
        """
        Find the position of a given item.
        """
        index = self.__index_to_add(item)
        if index < len(self) and self.__array[index] == item:
            return index
        raise ValueError(f"{item} not found")

    def clear(self) -> None:
        """
        Clear the list.
        """
        self.__array = []
        self.__length = 0
        self.__pointer = 0

    def __shuffle_right(self, index: int) -> None:
        """
        Shift items right starting at index to make room. Grows the array.
        """
        self.__array.append(None)
        for i in range(len(self), index, -1):
            self.__array[i] = self.__array[i - 1]

    def __shuffle_left(self, index: int) -> None:
        """
        Shift items left starting at index to fill the gap. Shrinks the array.
        """
        for i in range(index, len(self) - 1):
            self.__array[i] = self.__array[i + 1]
        self.__array.pop()

    def __index_to_add(self, item: T) -> int:
        """
        Binary search for finding the index to add an item.
        Best: O(1) when item is the middle element.
        Worst: O(log N) when item is first or last.
        """
        low = 0
        high = len(self) - 1

        while low <= high:
            mid = (low + high) // 2
            if self[mid] == item:
                return mid
            elif self[mid] < item:
                low = mid + 1
            else:
                high = mid - 1

        return low

    def __len__(self) -> int:
        return self.__length

    def __getitem__(self, index: int) -> T:
        if index < -1 * len(self) or index >= len(self):
            raise IndexError('Out of bounds access in list.')
        
        if index < 0:
            index = len(self) + index
        return self.__array[index]

    def __str__(self) -> str:
        return f'<ArraySortedList {self.__array}>'


# my_array_sorted_list = ArraySortedList()
# my_array_sorted_list.add(EntryBlock(date(2026, 8, 7), 4000, "monthly salary"))
# my_array_sorted_list.add(EntryBlock(date(2026, 8, 2), -90, "gym membership"))
# my_array_sorted_list.add(EntryBlock(date(2026, 8, 21), -80, "spotify subcription"))
# my_array_sorted_list.add(EntryBlock(date(2026, 8, 8), 100, "lalamove earning"))
# print(my_array_sorted_list)