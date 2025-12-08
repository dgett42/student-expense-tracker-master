import CategoryPieChart from './CategoryPieChart';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function ExpenseScreen() {
  const db = useSQLiteContext();

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editDate, setEditDate] = useState('');


  const loadExpenses = async () => {
    const rows = await db.getAllAsync(
      'SELECT * FROM expenses ORDER BY id DESC;'
    );
    setExpenses(rows);
    setFilteredExpenses(rows); 

  };
  
  const addExpense = async () => {
    const amountNumber = parseFloat(amount);

    if (isNaN(amountNumber) || amountNumber <= 0) {
    alert('Please enter an amount greater than 0');
    return;
  }

    const trimmedCategory = category.trim();
    const trimmedNote = note.trim();

    if (!trimmedCategory) {
    alert('Category is required');
    return;
  }

    const today = new Date().toISOString().split('T')[0]; 
   try {
    await db.runAsync(
          'INSERT INTO expenses (amount, category, note, date) VALUES (?, ?, ?, ?);',
      [amountNumber, trimmedCategory, trimmedNote || null, today]
    );

    setAmount('');
    setCategory('');
    setNote('');

    await loadExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert(`Error saving expense: ` + error.message);  
    }
  };

  const deleteExpense = async (id) => {
    await db.runAsync('DELETE FROM expenses WHERE id = ?;', [id]);
    loadExpenses();
  };


  const renderExpense = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
      setEditingExpense(item);
      setEditAmount(String(item.amount));
      setEditCategory(item.category);
      setEditNote(item.note || '');
      setEditDate(item.date);
      setIsEditing(true);
      }}
      >
      
      <View style={{ flex: 1 }}>
        <Text style={styles.expenseAmount}>${Number(item.amount).toFixed(2)}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        {item.note ? <Text style={styles.expenseNote}>{item.note}</Text> : null}
        <Text style={styles.expenseDate}>{item.date}</Text>
         

        <TouchableOpacity onPress={() => deleteExpense(item.id)}>
        <Text style={styles.delete}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  function applyFilter(allExpenses, filterType) {
  if (filterType === 'all') {
    return allExpenses;
  }

  const today = new Date();

  if (filterType === 'month') {
    const monthPrefix = today.toISOString().slice(0, 7); // "2025-11"
    return allExpenses.filter(e => e.date && e.date.startsWith(monthPrefix));
  }

  if (filterType === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const fromDate = weekAgo.toISOString().split('T')[0];

    return allExpenses.filter(e => e.date && e.date >= fromDate);
  }

  return allExpenses;
}

function getAnalytics(expensesList) {
  
  const total = expensesList.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  
  const byCategory = {};
  expensesList.forEach((e) => {
    const cat = e.category || 'Uncategorized';
    if (!byCategory[cat]) byCategory[cat] = 0;
    byCategory[cat] += Number(e.amount || 0);
  });

  return { total, byCategory };
}


  useEffect(() => {
    async function setup() {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          note TEXT,
          date TEXT NOT NULL
        );
      `);

      await loadExpenses();
    }

    setup();
  }, []);

  useEffect(() => {
  const result = applyFilter(expenses, filter);
  setFilteredExpenses(result);
}, [expenses, filter]);

const handleSaveEdit = async () => {
  if (!editingExpense) return;

  const amountNumber = parseFloat(editAmount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    alert('Invalid amount');
    return;
  }

  await db.runAsync(
    `UPDATE expenses
     SET amount = ?, category = ?, note = ?, date = ?
     WHERE id = ?`,
    [amountNumber, editCategory, editNote, editDate, editingExpense.id]
  );

  setIsEditing(false);
  setEditingExpense(null);

  loadExpenses();
};

const { total, byCategory } = getAnalytics(filteredExpenses);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Student Expense Tracker</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount (e.g. 12.50)"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Category (Food, Books, Rent...)"
          placeholderTextColor="#9ca3af"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Note (optional)"
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={setNote}
        />
        <Button title="Add Expense" onPress={addExpense} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
        <Button title="All" onPress={() => setFilter('all')} />
        <Button title="This Week" onPress={() => setFilter('week')} />
        <Button title="This Month" onPress={() => setFilter('month')} />
      </View>

      <View style={{ padding: 8 }}>
  <Text style={{ color: '#fff', fontWeight: '700' }}>
    Total: ${total.toFixed(2)}
  </Text>

  {Object.entries(byCategory).map(([cat, amt]) => (
    <Text key={cat} style={{ color: '#e5e7eb', fontSize: 12 }}>
      {cat}: ${amt.toFixed(2)}
    </Text>
  ))}
</View>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpense}
        ListEmptyComponent={
          <Text style={styles.empty}>No expenses yet.</Text>
        }
      />

      <Modal visible={isEditing} animationType="slide">
  <View style={{ flex: 1, padding: 20, backgroundColor: '#111827' }}>
    <Text style={{ fontSize: 20, marginBottom: 20, color: '#fff' }}>
      Edit Expense
    </Text>

    <TextInput
      style={styles.input}
      value={editAmount}
      onChangeText={setEditAmount}
      keyboardType="numeric"
      placeholder="Amount"
      placeholderTextColor="#9ca3af"
    />

    <TextInput
      style={styles.input}
      value={editCategory}
      onChangeText={setEditCategory}
      placeholder="Category"
      placeholderTextColor="#9ca3af"
    />

    <TextInput
      style={styles.input}
      value={editNote}
      onChangeText={setEditNote}
      placeholder="Note"
      placeholderTextColor="#9ca3af"
    />

    <TextInput
      style={styles.input}
      value={editDate}
      onChangeText={setEditDate}
      placeholder="YYYY-MM-DD"
      placeholderTextColor="#9ca3af"
    />

    <Button title="Save Changes" onPress={handleSaveEdit} />
    <View style={{ height: 10 }} />
    <Button title="Cancel" color="gray" onPress={() => setIsEditing(false)} />
  </View>
</Modal>


      <Text style={styles.footer}>
        Enter your expenses and they’ll be saved locally with SQLite.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#111827' },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
    gap: 8,
  },
  input: {
    padding: 10,
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fbbf24',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  expenseNote: {
    fontSize: 12,
    color: '#9ca3af',
  },
  delete: {
    color: '#f87171',
    fontSize: 20,
    marginLeft: 12,
  },
  empty: {
    color: '#9ca3af',
    marginTop: 24,
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 12,
    fontSize: 12,
  },
  expenseDate: {
  fontSize: 12,
  color: '#6b7280',
  marginTop: 4,
},
});