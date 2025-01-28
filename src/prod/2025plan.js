const goalSegment = document.getElementById("goals");
const goalDetailsSegment = document.getElementById("goal_details");
const roadMapSegment = document.getElementById("road_map");
const cl = "year-hidden";
const clp = "year-hidden-completly";

const manageClasses = (node, custom) => {
  if (node.classList.contains(custom ?? cl))
    node.classList.remove(custom ?? cl);
  else node.classList.add(custom ?? cl);
};

goalSegment.firstElementChild.addEventListener("click", () => {
  manageClasses(goalSegment);
});

goalDetailsSegment.firstElementChild.addEventListener("click", () => {
  manageClasses(goalDetailsSegment);
});

roadMapSegment.firstElementChild.addEventListener("click", () => {
  manageClasses(roadMapSegment);
});

Array.from([goalSegment, goalDetailsSegment, roadMapSegment]).forEach((x) => {
  x.classList.add(cl);
});
