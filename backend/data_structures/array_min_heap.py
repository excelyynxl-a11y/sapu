from typing import Generic, TypeVar, Iterable
from data_structures.array_sorted_list import ArraySortedList
from data_structures.entry_block import EntryBlock
from datetime import date
 
T = TypeVar('T')

class ArrayMinHeap(Generic[T]):
    """
    Minimum heap.
    Each node is an ArraySortedList. Heap property is maintained
    based on the EntryBlock at each ArraySortedList's current pointer.
    """

    def __init__(self, max_items: int = 1):
        if not max_items >= 0:
            raise ValueError("Heap must store 0 or more items.")
        self.__array = [None] * (max_items + 1)
        self.__length: int = 0

    def add(self, item: T) -> None:
        """
        Add an item to the heap.
        Best: O(1) — no rising needed.
        Worst: O(log N) — rise to the top, N = heap size.
        """
        if self.is_full():
            raise ValueError("Cannot add to full heap.")
        
        self.__length += 1
        self.__array[len(self)] = item
        self._rise(len(self)) # O(logN), rise to top

    def extract_root(self) -> T:
        """
        Extract the root of the heap (smallest element).
        Worst: O(log N) where N = heap size.
        """
        if self.__length == 0:
            raise ValueError("Cannot extract_root from empty heap.")
        res = self.__array[1]
        self.__array[1] = self.__array[len(self)]
        self.__length -= 1
        self._sink(1) # O(logN), sink to bottom
        return res

    def extract_min(self) -> T:
        """
        Alias for extract_root (min-heap).
        """
        return self.extract_root()

    def peek(self) -> T:
        """
        Return the root without removing it. 
        """
        if self.__length == 0:
            raise ValueError("Cannot peek from empty heap.")
        return self.__array[1]

    def is_full(self) -> bool:
        return len(self) == len(self.__array) - 1

    def __get_child_index(self, k: int) -> int:
        """
        Return the index of the smaller child of k.
        """
        k2 = k * 2
        if k2 == len(self) or self.__array[k2] < self.__array[k2 + 1]:
            return k2
        else:
            return k2 + 1

    def _rise(self, k: int) -> None:
        """
        Rise the element at index k.
        Best: O(1) — no rising.
        Worst: O(log N) — rise to top.
        """
        rising_item = self.__array[k]
        while k > 1 and rising_item < self.__array[k // 2]:
            self.__array[k] = self.__array[k // 2]
            k = k // 2
        self.__array[k] = rising_item

    def _sink(self, k: int) -> None:
        """
        Sink the element at index k.
        Best: O(1) — no sinking.
        Worst: O(log N) — sink to bottom.
        """
        sinking_item = self.__array[k]
        while 2 * k <= len(self):
            child_i = self.__get_child_index(k)
            if sinking_item < self.__array[child_i]:
                break
            self.__array[k] = self.__array[child_i]
            k = child_i
        self.__array[k] = sinking_item

    @staticmethod
    def heapify(items: Iterable[T]) -> 'ArrayMinHeap[T]':
        """
        Construct a heap from an iterable of items.
        Returns: A heap containing items in the iterable.
        Complexity: O(n) where n = number of items = heap size.
        """
        try:
            length = len(items)
            array = [None] * (length + 1)
            for i, item in enumerate(items):
                array[i + 1] = item
        except TypeError:
            def resize(array):
                new_array = [None] * (len(array) * 2)
                for i in range(len(array)):
                    new_array[i] = array[i]
                return new_array

            array = [None] * 2
            i = -1
            for i, item in enumerate(items):
                if i + 1 >= len(array):
                    array = resize(array)
                array[i + 1] = item
            length = i + 1

        heap = ArrayMinHeap(length)
        heap._ArrayMinHeap__array = array
        heap._ArrayMinHeap__length = length

        for i in range(len(heap) // 2, 0, -1):
            heap._sink(i)

        return heap

    def values(self):
        """
        Get the values in no particular order.
        """
        res = [None] * len(self)
        for i in range(1, len(self) + 1):
            res[i - 1] = self.__array[i]
        return res

    def __len__(self) -> int:
        return self.__length

    def __str__(self) -> str:
        res = [None] * self.__length
        for i in range(self.__length):
            res[i] = str(self.__array[i + 1])
        return '<ArrayMinHeap([' + ', \n'.join(res) + '])>'

# gym = ArraySortedList()
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# gym.add(EntryBlock(date(2026, 3, 1), -100, "gym"))
# print(gym)
# xhs_income = ArraySortedList()
# xhs_income.add(EntryBlock(date(2026, 3, 3), 50, "xhs income"))
# xhs_income.add(EntryBlock(date(2026, 3, 17), 50, "xhs income"))
# xhs_income.add(EntryBlock(date(2026, 3, 31), 50, "xhs income"))
# xhs_income.add(EntryBlock(date(2026, 4, 14), 50, "xhs income"))
# xhs_income.add(EntryBlock(date(2026, 4, 28), 50, "xhs income"))
# print(xhs_income)
# spotify = ArraySortedList()
# spotify.add(EntryBlock(date(2026, 3, 4), -50, "spotify"))
# spotify.add(EntryBlock(date(2026, 3, 14), -50, "spotify"))
# spotify.add(EntryBlock(date(2026, 3, 24), -50, "spotify"))
# spotify.add(EntryBlock(date(2026, 4, 3), -50, "spotify"))
# spotify.add(EntryBlock(date(2026, 4, 13), -50, "spotify"))
# spotify.add(EntryBlock(date(2026, 4, 23), -50, "spotify"))
# print(spotify)
# car_loan = ArraySortedList()
# car_loan.add(EntryBlock(date(2026, 3, 7), -1000, "car loan"))
# car_loan.add(EntryBlock(date(2026, 4, 7), -1000, "car loan"))
# print(car_loan)
# monthly_salary = ArraySortedList()
# monthly_salary.add(EntryBlock(date(2026, 3, 7), 4000, "monthly salary"))
# monthly_salary.add(EntryBlock(date(2026, 4, 7), 4000, "monthly salary"))
# print(monthly_salary)

# print('============= ARRAY MIN HEAP ==============')
# my_array_min_heap = ArrayMinHeap().heapify([xhs_income, gym, monthly_salary, spotify, car_loan])
# for i in range(len(my_array_min_heap)):
#     print(my_array_min_heap.extract_root())