$(document).ready(() => {
  const svg = d3.select('#map').append('svg');
  // California Albers projection, see:
  // https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
  const projection = d3.geoConicEqualArea().parallels([34, 40.5]).rotate([120, 0]);
  const geoPath = d3.geoPath().projection(projection);
  let sfMesh

  d3.json('../sf/streets.json').then(sf => {
    sfMesh = topojson.mesh(sf);

    svg.append('path');
    resizeMap();
    $(window).resize(resizeMap);
  });

  function resizeMap() {
    const mapContainer = $('#map');

    projection.fitSize([mapContainer.innerWidth(), mapContainer.innerHeight()], sfMesh);

    svg.select('path')
      .attr('d', geoPath(sfMesh));
  }
});
