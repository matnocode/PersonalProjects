const yearSegment2025 = document.getElementById("yearSegment2025");
const yearButton2025 = document.getElementById("yearButton2025");
const cl = "year-hidden";
const clp = "year-hidden-completly";

const manageClasses = (node, custom) => {
  if (node.classList.contains(custom ?? cl))
    node.classList.remove(custom ?? cl);
  else node.classList.add(custom ?? cl);
};

yearButton2025.addEventListener("click", () => {
  manageClasses(yearSegment2025);
});

const monthSegmentJan2025 = document.getElementById("monthSegmentJan2025");
const monthButtonJan2025 = document.getElementById("monthButtonJan2025");

monthButtonJan2025.addEventListener("click", () => {
  manageClasses(monthSegmentJan2025);
});

const articleWrappers = document.getElementsByClassName("article-wrapper");

Array.from(articleWrappers).forEach((x, i) => {
  x.firstElementChild.addEventListener("click", () =>
    manageClasses(x.lastElementChild, clp)
  );
  if (i == 0) return;

  x.lastElementChild.classList.add(clp);
});
