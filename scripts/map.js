$(document).ready(() => {
  const svg = d3.select('#map').append('svg');
  const videoLayer = d3.select('#map').append('div').attr('id', 'video-layer');

  // Add separate groups for the base map and the venue points to ensure the venues render on top
  // of the map. Order matters!
  const baseMapGroup = svg.append('g');

  // California Albers projection, see:
  // https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c
  const projection = d3.geoConicEqualArea().parallels([34, 40.5]).rotate([120, 0]);
  const geoPath = d3.geoPath().projection(projection);
  let sfMesh;

  d3.json('../sf/streets.json').then(sf => {
    sfMesh = topojson.mesh(sf);

    baseMapGroup.append('path');

    // Add all the videos
    venues.forEach(venue => {
      const videoObj = videos.find(video => video.venueId === venue.venueId);

      if (videoObj != null) {
        videoLayer.append('iframe')
          .attr('id', videoObj.venueId)
          .attr('src', videoObj.video)
          .attr('allow', 'autoplay');
      }
    });

    resizeMap();
    $(window).resize(resizeMap);
  });

  function resizeMap() {
    const mapContainer = $('#map');

    projection.fitSize([mapContainer.innerWidth(), mapContainer.innerHeight() * 1.25], sfMesh);

    venues.forEach(venue => {
      const point = projection(venue.location.slice().reverse());

      baseMapGroup.select('path')
        .attr('d', geoPath(sfMesh));

      d3.select(`#${venue.venueId}`)
        .style('left', `${point[0]}px`)
        .style('top', `${point[1]}px`);
    });


  }

});
