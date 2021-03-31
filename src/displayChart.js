import fetchData from './fetchData.js'

const displayChart = async () => {
  const chartContainer = document.querySelector('.chart-container')
  const chartHeight = chartContainer.getBoundingClientRect().height
  const chartWidth = chartContainer.getBoundingClientRect().width
  const { data: dataset } = await fetchData()

  let tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
  // .style('opacity', 0)

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

  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), new Date(d3.max(yearsDate))])
    .range([padding, chartWidth - padding])

  const xAxis = d3.axisBottom(xScale)

  svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('class', 'bar')
    .attr(
      'x',
      (d, i) => padding + ((chartWidth - padding * 2) / dataset.length) * i
    )
    .attr('y', (d) => yScale(d[1]))
    .attr('width', (chartWidth - padding * 2) / dataset.length + 1)
    .attr('height', (d) => chartHeight - padding - yScale(d[1]))
    .on('mouseover', (e) => {
      const element = e.target.getBoundingClientRect()
      const left = (element.right + element.left) / 2
      const date = e.target.dataset.date
      const gdp = e.target.dataset.gdp
      const tooltip = document.getElementById('tooltip')
      const refactorDate = (date = string) => {
        const year = date.substring(0, 4)
        let quarter = date.substring(5, 7)
        if (quarter === '01') {
          quarter = `Q1`
        }
        if (quarter === '04') {
          quarter = `Q2`
        }
        if (quarter === '07') {
          quarter = `Q3`
        }
        if (quarter === '10') {
          quarter = `Q4`
        }
        return `${year}, ${quarter}</>`
      }
      tooltip.innerHTML = `<h3>${refactorDate(date)}<h3>
      <h4>$${gdp} Billions</h4>`
      tooltip.classList.add('active')
      tooltip.style.left = `${left}px`
      tooltip.dataset.date = date
    })
    .on('mouseout', (e, i) => {
      const tooltip = document.getElementById('tooltip')
      tooltip.classList.remove('active')
    })

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
}

export default displayChart
