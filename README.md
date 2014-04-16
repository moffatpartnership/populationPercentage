## Global Connections

#### HTML
The index.html file contains the normal includes for the CSS and Javascript files.

As part of the copyright agreement you will have to include the text that explains the process (you'd want to do that anyway…)

First element explain the process globally

```
<div>
        <p>The population percentage plots use a population genetic model to estimate your overall ancestry and put this in context using nearly 4000 people from across the world. The model finds eleven clusters of individuals who are genetically similar to each other, using hundreds of thousands of markers from across the genome. These clusters are also known as ancestry components, as they represent the percentage of DNA each individual has from these inferred ancestral clusters.</p>
        <p>In the plot each cluster or ancestry component is coloured differently to show the different origins of people – the plot is made up of thousands of thin vertical lines or columns representing individuals, each coloured according to the ancestry components of the individual. Some individuals are composed almost entirely from one ancestry component, for example many Han Chinese are over 90% East Asian, while other individuals are of mixed heritage, with ancestry from multiple clusters. Your own population percentage is plotted in the larger column. The eleven ancestry components are described in more detail below. Note that this is a complex analysis and so there is some statistical noise: ancestry components below about 1-3% are potentially not informative.</p>
</div>
```

The next element is the container for the select element to select the different plots, there are seven in total.

```
<div id="PPSelect">
</div>
```

The third block is for the canvas and the description of that particular plot. The element for the description is nested within the canvas element.

```
<div id="canvasPopulationPercentage" data-population-percentage-id="52a0819a939138472f0007da">
         <div id="plotDescription">
         </div>
</div>
```

The Canvas used for the plots will be created by the javascript as a child of the div element with the id canvasPopulationPercentage.
There is a test AMA result id within the attribute data-population-percentage-id you would replace this with the AMA result id for the customer.

###### Script tags

Jquery is used minimally and will be depreciated. (yuck)

The GSAP Greensock library is currently only used for the Ticker. The library usage will increase in future versions.

The two createjs libraries are used extensively.

You can use the stats display for performance monitoring, uncomment the initial load and jquery lines in the PPViewer.loadInit function, then uncomment the start and stop lines in the frameRender function.

#### CSS

There is a very simple CSS preloader within the #Processing styling with links to two assets in the /img folder. Otherwise please note the normal canvas margin and padding fills.

#### Javascript

The javascript file haplogroupFrequencies.js has an anonymous executing function called HFViewer, this loads the assets on start-up and then when all is loaded the GSAP Ticker fires the frameRender function.

There are three other anonymous functions handling the loading and the drawing.

#### Support

Email me at alan@scotlandsdna.com for any questions and usage.

©The Moffat Partnership
