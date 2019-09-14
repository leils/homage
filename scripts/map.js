$(document).ready(() => {
  const svg = d3.select('#map').append('svg');

  // Add separate groups for the base map and the venue points to ensure the venues render on top
  // of the map. Order matters!
  const baseMapGroup = svg.append('g');
  const venueGroup = svg.append('g');

  // California Albers projection, see:
  // https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
  const projection = d3.geoConicEqualArea().parallels([34, 40.5]).rotate([120, 0]);
  const geoPath = d3.geoPath().projection(projection);
  let sfMesh;

  d3.json('../sf/streets.json').then(sf => {
    sfMesh = topojson.mesh(sf);

    baseMapGroup.append('path');
    resizeMap();
    $(window).resize(resizeMap);
  });

  function resizeMap() {
    const mapContainer = $('#map');

    projection.fitSize([mapContainer.innerWidth(), mapContainer.innerHeight() * 1.5], sfMesh);

    svg.select('path')
      .attr('d', geoPath(sfMesh));

    const venuePoints = venueGroup.selectAll('circle').data(venues, venue => venue.venueId);

    venuePoints.join('circle')
      .attr('class', 'venue')
      .attr('r', 10)
      .attr('cx', venue => projection(venue.location.slice().reverse())[0])
      .attr('cy', venue => projection(venue.location.slice().reverse())[1]);
  }
});
