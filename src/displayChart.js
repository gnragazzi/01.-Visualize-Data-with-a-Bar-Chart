import fetchData from './fetchData.js'

const displayChart = async () => {
  const chartContainer = document.querySelector('.chart-container')
  const chartHeight = chartContainer.getBoundingClientRect().height
  const chartWidth = chartContainer.getBoundingClientRect().width
  const { data: dataset } = await fetchData()
  const date = dataset.map(([item]) => {
    const year = item.substring(0, 4)
    let quarter
    switch (item.substring(5, 7)) {
      case '01':
        quarter = 'Q1'
        break
      case '04':
        quarter = 'Q2'
        break
      case '07':
        quarter = 'Q3'
        break
      case '10':
        quarter = 'Q4'
        break
    }
    return `${year} ${quarter}`
  })

  const svg = d3
    .select('.chart-container')
    .append('svg')
    .attr('class', 'svg')
    .attr('height', chartHeight)
    .attr('width', chartWidth)
  const padding = 50
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([chartHeight - padding, padding])

  const yearsDate = dataset.map(function (item) {
    return new Date(item[0])
  })

  var xMax = new Date(d3.max(yearsDate))
  xMax.setMonth(xMax.getMonth() + 3)
  console.log(xMax)

  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([padding, chartWidth - padding])

  const xAxis = d3.axisBottom(xScale)

  svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('data-date', (d, i) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('class', 'bar')
    .attr('x', (d, i) => padding + i * 2.25)
    .attr('y', (d) => yScale(d[1]))
    .attr('width', chartWidth / dataset.length - 1)
    .attr('height', (d) => chartHeight - padding - yScale(d[1]))
    .attr('fill', 'gray')

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${chartHeight - padding * 1})`)
    .call(xAxis)
  const yAxis = d3.axisLeft(yScale)
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding},0)`)
    .call(yAxis)

  var tooltip = d3
    .select(chartContainer)
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .attr('data-date', '')
  const bars = document.querySelectorAll('.bar')
  bars.forEach((bar) => {
    bar.addEventListener('mouseover', (e) => {
      const element = e.target.getBoundingClientRect()
      const center = (element.top + element.bottom) / 2
      const left = (element.right + element.left) / 2
      const date = e.target.dataset.date
      const gdp = e.target.dataset.gdp
      const tooltip = document.getElementById('tooltip')
      tooltip.innerHTML = `<h3>${date}<h3><h4>${gdp}</h4>`
      tooltip.classList.add('active')
      tooltip.style.top = `${center}px`
      tooltip.style.left = `${left}px`
      tooltip.dataset.date = date
    })
  })
  window.addEventListener('mouseover', (e) => {
    if (!e.target.classList.contains('bar')) {
      const tooltip = document.getElementById('tooltip')
      tooltip.classList.remove('active')
    }
  })
}

export default displayChart
