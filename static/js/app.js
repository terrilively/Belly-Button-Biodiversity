//Create variables for each of the html id tags
function getPlots(id) {
//Read samples.json
    d3.json("samples.json").then (sampledata => {
      var sample = sampledata.samples.filter(sample => sample.id === id)[0];
  
  //Pull the top 10 otu IDs and reverse it
      var OTU_top = sample.sample_values.slice(0, 10).reverse();
      var OTU_id = sample.otu_ids.slice(0,10).reverse().map(d =>"OUT" + d);
      var labels = sample.otu_labels.slice(0, 10).reverse();
      var trace = {
        x: OTU_top,
        y: OTU_id,
        text: labels,
        marker: {
        color: 'blue'},
        type: 'bar',
        orientation: 'h',
      };
    
    //Create Data Variable
    var data = [trace];
    //Create Layout Variable to set plots
    var layout = {
        title: "Top 10 OTU",
        yaxis:{
          tickmode:"linear",
        },
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 30
        }
  };
    //Create Bar Plot
  Plotly.newPlot("bar", data, layout);
    //Create the Bubble Chart
    var trace1 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      mode: "markers",
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      },
      text: sample.otu_labels
  };

    //Set Layout for the Bubble Plot
    var layout_2 = {
      xaxis:{title: "OTU ID"},
      height: 600,
      width: 1000
  };
    //Create data variable
    var data1 = [trace1];
    //Create Bubble Plot
    Plotly.newPlot("bubble", data1, layout_2);
    });
}
//Create a function to get necessary data
function getDemoInfo(id) {
//Read the JSON file to get data
  d3.json("samples.json").then((data) => {
//Get metadata info for the Demographics Panel
    
    var metadata = data.metadata;
    //Filter meta data info by ID
    var result = metadata.filter(meta => meta.id.toString()=== id)[0];
    
    //Select Demographic Panel to put data
    var demographicInfo = d3.select("#sample-metadata");
    //Empty the Demographic info panel each time before getting new ID info
    demographicInfo.html("");
    //Grab necessary Demographic Data for IDs and append info to the Panel
      Object.entries(result).forEach(key => {
        demographicInfo.append("h5").text(key[0].toUpperCase() +": " + key[1] + "\n");
      });
  });
}

//Create a function for the change event
function optionChanged(id) {
  console.log(id);
    getPlots(id);
    getDemoInfo(id);
}

//Create a function for the intial data rendering
function init() {
    //Select Dropdown Menu
    var dropdown = d3.select("#selDataset");

  //Read Data
  d3.json("samples.json").then((data) => {
    //Get ID Data to the Dropdown menu
    data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value");
    });

    //Call functions to display data and plots
    getPlots(data.names[0]);
    getDemoInfo(data.names[0]);
  });
}


init();