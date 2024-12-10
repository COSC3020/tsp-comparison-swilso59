# Traveling Salesperson Problem -- Empirical Analysis

For this exercise, you'll need to take the code from the TSP Held-Karp and TSP
Local Search exercises. This can be your own implementation or somebody else's.
You will now do an empirical analysis of the implementations, comparing their
performance. Both the Held-Karp and the Local Search algorithms solve the same
problem, but they do so in completely different ways. This results in different
solutions, and in different times required to get to the solution.

Investigate the implementations' empirical time complexity, i.e. how the runtime
increases as the input size increases. *Measure* this time by running the code
instead of reasoning from the asymptotic complexity (this is the empirical
part). Create inputs of different sizes and plot how the runtime scales (input
size on the $x$ axis, time on the $y$ axis). Your largest input should have a
runtime of *at least* an hour. The input size that gets you to an hour will
probably not be the same for the Held-Karp and Local Search implementations.

In addition to the measured runtime, plot the tour lengths obtained by both
implementations on the same input distance matrices. The length of the tour that
Held-Karp found should always be less than or equal to the tour length that
Local Search found. Why is this?

Add the code to run your experiments, graphs, and an explanation of what you did
to this markdown file.

## Answer 

I ran both these algorithms on different size distance matrices. Starting from $1 \times 1$ and going up to $19 \times 19$. I could not get my program to complete for an hour because for a $20 \times 20$ matrix I let it run overnight. The program ran for over 12 hours and did not find a result. I then attempted to used a different implementation of `tsp_hk` from the repository. 

- https://github.com/COSC3020/tsp-comparison-KobeLimon21 

This allowed me to run the $20 \times 20$ matrix and compare it to my tsp_local implementation. This allowed me to reach the 20 city mark in a reasonable amount of time however for 21 cities it has taken over 2 hours. The runtime of the local search compared to HK was much better consistently producing results within milliseconds even for larger matrices. The tour lengths differed significantly from HK. which only increased with the larger matrices. This aligns with the theoretical description that HK always finds the exact minimum tour length while local search sacrifices accuracy for speed. 
To analyze the empirical time complexity of these algorithms, I plotted the runtime on the `y` axis and number of cities on the `x` and plotted the tour lengths on the `y` axis and number of cities on the `x` axis to compare the runtimes against number of cities and results for minimum tour against number of cities. This shows me that HK is suitable for small matrices where accuracy is the priority. With some adjustments local search can be practical for larger matrices where speed is more important than accuracy.

## Plagiarism Acknowledgement 

For this assignment I started off using my own code. I created some functions to run the HK and local tsp algorithms on a provided distance matrix and measure how long it takes to find the minimum tour and time it takes. Then I made a function to generate the distance matrix of the specified size. I wanted to use python to graph the data since I dont have much experiance with this I used chat gpt for writing the sections that put the results into a csv file and python script to plot the results from the csv file. 

“I certify that I have listed all sources used to complete this exercise, including the use
of any Large Language Models. All of the work is my own, except where stated
otherwise. I am aware that plagiarism carries severe penalties and that if plagiarism is
suspected, charges may be filed against me without prior notice.”


