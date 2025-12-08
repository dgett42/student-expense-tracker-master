import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function CategoryPieChart({ byCategory }) {
  const data = useMemo(() => {
    if (!byCategory) return [];

    const entries = Object.entries(byCategory);
    if (entries.length === 0) return [];

    const colors = [
      '#f97316', // orange
      '#22c55e', // green
      '#3b82f6', // blue
      '#eab308', // yellow
      '#ec4899', // pink
      '#a855f7', // purple
      '#14b8a6', // teal
      '#facc15', // amber
    ];

      return entries.map(([name, value], index) => ({
      name,
      amount: value,
      color: colors[index % colors.length],
      legendFontColor: '#e5e7eb',
      legendFontSize: 12,
    }));

     }, [byCategory]);

  const hasData = data.length > 0 && data.some(item => item.amount > 0);

  if (!hasData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>Spending by Category</Text>
        <Text style={styles.emptyText}>
          Add some expenses to see a category breakdown.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending by Category</Text>
      <Text style={styles.subtitle}>
        Total amount spent per category (current filter)
      </Text>

      <PieChart
        data={data}
        width={screenWidth - 32}
        height={220}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="12"
        center={[0, 0]}
        hasLegend={true}
        chartConfig={{
          color: (opacity = 1) => `rgba(248, 250, 252, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(248, 250, 252, ${opacity})`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#020617',
  },
  emptyContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});