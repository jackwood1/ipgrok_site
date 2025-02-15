const visibleColumns = ['first name', 'last name', 'change'];
let allColumnsShown = false;
function createDropdown(columns, fileName, containerId, numColumns, numRows, fileSize) {
  const dropdownContainer = document.getElementById(containerId);
  dropdownContainer.innerHTML = ''; // Clear any existing dropdown

  const label = document.createElement('label');
  label.textContent = `${fileName} (Columns: ${numColumns}, Rows: ${numRows}, Size: ${fileSize} bytes)`;
  dropdownContainer.appendChild(label);

  const select = document.createElement('select');
  columns.forEach(column => {
    const option = document.createElement('option');
    option.textContent = column;
    select.appendChild(option);
  });

  dropdownContainer.appendChild(select);
}

async function callApi(file, containerId) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://127.0.0.1:5000?url=http://localhost:5008/api/getfiledetails', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (!data || !data.columns) {
      throw new Error('Invalid API response');
    }
    console.log('API Response:', data);
    createDropdown(data.columns, file.name, containerId, data.num_columns, data.num_rows, data.file_size);
  } catch (error) {
    console.error('Error calling API:', error);
    document.getElementById('error').textContent = 'Error: ' + error.message;
  }
}

function checkFilesSelected() {
  const file1 = document.getElementById('file1').files[0];
  const file2 = document.getElementById('file2').files[0];
  const submitButton = document.getElementById('submitButton');
  const dropdownSection = document.getElementById('dropdownSection');

  if (file1 && file2) {
    submitButton.style.display = 'block';
  } else {
    submitButton.style.display = 'none';
  }

  if (file1 || file2) {
    const step3Text = document.createElement('div');
    step3Text.className = 'step';
    step3Text.textContent = 'Step 3 - File details are shown below.';
    if (!dropdownSection.querySelector('.step')) {
      dropdownSection.insertBefore(step3Text, dropdownSection.firstChild);
    }
  }
}

document.getElementById('file1').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    callApi(file, 'dropdownContainer1');
  }
  checkFilesSelected();
});

document.getElementById('file2').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    callApi(file, 'dropdownContainer2');
  }
  checkFilesSelected();
});

document.getElementById('fileForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const file1 = document.getElementById('file1').files[0];
  const file2 = document.getElementById('file2').files[0];
  const validateData = document.getElementById('validateData').checked;
  const normalizeData = document.getElementById('normalizeData').checked;
  const hideFileCompareData = document.getElementById('hideFileCompareData').checked;

  if (file1 && file2) {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file1.type) || !allowedTypes.includes(file2.type)) {
      document.getElementById('error').textContent = 'Please select valid CSV or Excel files.';
      return;
    }

    if (file1.size > maxSize || file2.size > maxSize) {
      document.getElementById('error').textContent = 'File size exceeds the 5MB limit.';
      return;
    }

    console.log('File 1:', file1.name);
    console.log('File 2:', file2.name);

    // Show loading message and disable submit button
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submitButton').disabled = true;

    // Call the API to compare the files
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('validateData', validateData);
    formData.append('normalizeData', normalizeData);
    formData.append('hideFileCompareData', hideFileCompareData);

    try {
      const response = await fetch('http://127.0.0.1:5000?url=http://localhost:5008/api/benefitscompare', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();

      console.log('Comparison API Response:', responseData);

      // Hide loading message and show the result section
      document.getElementById('loading').style.display = 'none';
      document.getElementById('resultSection').style.display = 'block';

      // Build and display the table using the 'general' key
      const resultContent = document.getElementById('resultContent');
      const responseJson = JSON.parse(responseData)
      const generalData = responseJson.general;

      if (Array.isArray(generalData) && generalData.length > 0) {
        const columns = Object.keys(generalData[0]);
        resultContent.innerHTML = buildTable(generalData, 'generalTable', 'resultContent', columns, visibleColumns);
      } else {
        resultContent.textContent = 'No data available';
      }

    } catch (error) {
      console.error('Error calling comparison API:', error);
      document.getElementById('error').textContent = 'Error: ' + error.message;
      document.getElementById('loading').style.display = 'none';
      document.getElementById('resultSection').style.display = 'block';
    } finally {
      document.getElementById('submitButton').disabled = false;
    }
  } else {
    document.getElementById('error').textContent = 'Please select both files.';
  }
});

function buildTable(data, tableId, containerId, columns, visibleColumns = []) {
  if (!Array.isArray(data) || data.length === 0) {
    return '<p>Data is not an array or is empty</p>';
  }

  let table = `<button class="export-button" onclick="exportTableToCSV('${tableId}', '${tableId}.csv')">Export to CSV</button>`;
  table += `<input type="text" class="filter-input" placeholder="Search...">`;
  table += `<button class="toggle-button" onclick="toggleColumns('${tableId}')">Show All Columns</button>`;
  table += `<div class="table-wrapper">`;
  table += `<table id="${tableId}" border="1"><thead><tr>`;
  columns.forEach((column, index) => {
    const displayStyle = visibleColumns.includes(column) ? '' : 'style="display: none;"';
    table += `<th class="draggable" draggable="true" data-index="${index}" ${displayStyle} onclick="sortTable('${tableId}', ${index})">${column}</th>`;
  });
  table += '</tr></thead><tbody>';

  data.forEach((row, rowIndex) => {
    table += '<tr>';
    columns.forEach(column => {
      const displayStyle = visibleColumns.includes(column) ? '' : 'style="display: none;"';
      table += `<td data-column="${column}" data-row="${rowIndex}" ${displayStyle}>${row[column]}</td>`;
    });
    table += '</tr>';
  });

  table += '</tbody></table>';
  table += `</div>`;
  return table;
}

function exportTableToCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  const rows = table.querySelectorAll('tr');
  let csvContent = '';

  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    const rowData = Array.from(cols).map(col => col.textContent).join(',');
    csvContent += rowData + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}

function exportAllTablesToCSV(filename) {
  const tables = document.querySelectorAll('table');
  let csvContent = '';

  tables.forEach((table, tableIndex) => {
    const rows = table.querySelectorAll('tr');
    csvContent += `Table ${tableIndex + 1}\n`;

    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th');
      const rowData = Array.from(cols).map(col => col.textContent).join(',');
      csvContent += rowData + '\n';
    });

    csvContent += '\n'; // Add a blank line between tables
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}_${timestamp}.csv`);
  a.click();
}

function addExportAllButton(containerId) {
  const container = document.getElementById(containerId);
  const button = document.createElement('button');
  button.textContent = 'Export All Tables to CSV';
  button.addEventListener('click', () => exportAllTablesToCSV('all_tables'));
  container.appendChild(button);
}

document.addEventListener('DOMContentLoaded', () => {
  addExportAllButton('resultContent');
});

$(document).on('input', '.filter-input', function() {
  const filter = $(this).val().toLowerCase();
  $(this).next('table').find('tbody tr').each(function() {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(filter));
  });
});

$(document).on('click', 'th', function() {
  const table = $(this).closest('table');
  const tbody = table.find('tbody');
  const rows = tbody.find('tr').toArray();
  const index = $(this).index();
  const isAscending = $(this).hasClass('asc');

  rows.sort((a, b) => {
    const cellA = $(a).children('td').eq(index).text();
    const cellB = $(b).children('td').eq(index).text();
    return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
  });

  $(this).toggleClass('asc', !isAscending);
  $(this).toggleClass('desc', isAscending);
  tbody.append(rows);
});

function filterTable(criteria) {
  $('table tbody tr').each(function() {
    const row = $(this);
    let match = false;
    row.find('td').each(function() {
      if ($(this).text().toLowerCase().includes(criteria.toLowerCase())) {
        match = true;
        return false; // Break the loop
      }
    });
    row.toggle(match);
  });
}

function toggleColumns(tableId) {
  const table = document.getElementById(tableId);
  const ths = table.querySelectorAll('th');
  const tds = table.querySelectorAll('td');
  const button = document.querySelector('.toggle-button');

  if (allColumnsShown) {
    // Hide columns not in visibleColumns
    ths.forEach(th => {
      const columnName = th.textContent.trim().toLowerCase();
      th.style.display = visibleColumns.includes(columnName) ? '' : 'none';
    });

    tds.forEach(td => {
      const columnName = td.getAttribute('data-column').toLowerCase();
      td.style.display = visibleColumns.includes(columnName) ? '' : 'none';
    });

    button.textContent = 'Show All Columns';
  } else {
    // Show all columns
    ths.forEach(th => th.style.display = '');
    tds.forEach(td => td.style.display = '');

    button.textContent = 'Show Only Selected Columns';
  }

  allColumnsShown = !allColumnsShown;
}

function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const isAscending = table.querySelectorAll('th')[columnIndex].classList.toggle('asc');

  rows.sort((a, b) => {
    const cellA = a.children[columnIndex].textContent.trim();
    const cellB = b.children[columnIndex].textContent.trim();
    return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
  });

  rows.forEach(row => tbody.appendChild(row));
}

