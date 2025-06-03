document.addEventListener('DOMContentLoaded', () => {
  const data = [
    { name: 'Item 1', value: 10 },
    { name: 'Item 2', value: 20 },
    { name: 'Item 3', value: 30 },
    { name: 'Item 4', value: 40 }
  ];

  const tableBody = document.querySelector('#dataTable tbody');

  function renderTable(rows) {
    tableBody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.name}</td><td>${row.value}</td>`;
      tableBody.appendChild(tr);
    });
  }

  renderTable(data);

  const ctx = document.getElementById('chart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: 'Values',
        data: data.map(d => d.value),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = data.filter(row => row.name.toLowerCase().includes(query));
    renderTable(filtered);
  });
});
