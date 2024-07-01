import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format } from 'date-fns';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortKey, setSortKey] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchTransactions = async (page) => {
    try {
      const response = await axios.get(`/api/transactions?page=${page}`);
      const newTransactions = response.data;

      if (newTransactions.length === 0) {
        setHasMore(false);
      }

      setTransactions(prev => [...prev, ...newTransactions]);
      setFilteredTransactions(prev => [...prev, ...newTransactions]);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch transactions.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  useEffect(() => {
    let filtered = transactions;

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter(transaction => {
        const date = new Date(transaction.date);
        return date >= startDate && date <= endDate;
      });
    }

    // Search by keyword
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by key
    filtered.sort((a, b) => {
      if (sortKey === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortKey === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, startDate, endDate, sortKey, sortOrder, transactions]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="p-2 border border-gray-300 rounded"
          />
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <label>Sort by:</label>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <InfiniteScroll
        dataLength={filteredTransactions.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="text-center p-4">Loading more...</div>}
        endMessage={<div className="text-center p-4">No more transactions.</div>}
      >
        <div className="overflow-y-scroll max-h-[600px] border border-gray-300 rounded-lg">
          {filteredTransactions.length === 0 ? (
            <div className="text-center p-4">No transactions found.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTransactions.map(transaction => (
                <li key={transaction.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">{transaction.title}</div>
                    <div className="text-lg font-medium text-gray-700">${transaction.amount}</div>
                  </div>
                  <div className="text-sm text-gray-500">{format(new Date(transaction.date), 'yyyy-MM-dd')}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default TransactionList;
