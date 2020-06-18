import { disjointCluster, normalizeSolution, greedyLayout, lossFunction, distanceFromIntersectArea } from './layout';
import { distance, intersectionArea, circleCircleIntersection, circleOverlap, circleArea } from './circleintersection';
import { computeTextCentre } from './diagram';

describe('greedyLayout', () => {
  test('0', () => {
    const areas = [
      { sets: [0], size: 0.7746543297103429 },
      { sets: [1], size: 0.1311252856844238 },
      { sets: [2], size: 0.2659942131443344 },
      { sets: [3], size: 0.44600866168641723 },
      { sets: [0, 1], size: 0.02051532092950205 },
      { sets: [0, 2], size: 0 },
      { sets: [0, 3], size: 0 },
      { sets: [1, 2], size: 0 },
      { sets: [1, 3], size: 0.07597023820511245 },
      { sets: [2, 3], size: 0 },
    ];
    const circles = greedyLayout(areas);
    const loss = lossFunction(circles, areas);
    expect(loss).toBeCloseTo(0);
  });

  test('1', () => {
    const areas = [
      { sets: [0], size: 0.5299368855059736 },
      { sets: [1], size: 0.03364187025606481 },
      { sets: [2], size: 0.3121450394871512 },
      { sets: [3], size: 0.0514397361783036 },
      { sets: [0, 1], size: 0.013912447645582351 },
      { sets: [0, 2], size: 0.005903647141469598 },
      { sets: [0, 3], size: 0.0514397361783036 },
      { sets: [1, 2], size: 0.012138157839477597 },
      { sets: [1, 3], size: 0.008010688232481479 },
      { sets: [2, 3], size: 0 },
    ];

    const circles = greedyLayout(areas);
    const loss = lossFunction(circles, areas);
    expect(loss).toBeCloseTo(0);
  });

  test('3', () => {
    // one small circle completely overlapped in the intersection
    // area of two larger circles
    const areas = [
      { sets: [0], size: 1.7288584050841396 },
      { sets: [1], size: 0.040875831658950056 },
      { sets: [2], size: 2.587146019782323 },
      { sets: [0, 1], size: 0.040875831658950056 },
      { sets: [0, 2], size: 0.5114617575187569 },
      { sets: [1, 2], size: 0.040875831658950056 },
    ];

    const circles = greedyLayout(areas);
    const loss = lossFunction(circles, areas);
    expect(loss).toBeCloseTo(0);
  });
});

test('circleArea', () => {
  expect(circleArea(10, 0)).toBeCloseTo(0); //  'empty circle test');
  expect(circleArea(10, 10)).toBeCloseTo((Math.PI * 10 * 10) / 2); // , 'half circle test');
  expect(circleArea(10, 20)).toBeCloseTo(Math.PI * 10 * 10); // 'full circle test');
});

test('circleOverlap', () => {
  expect(circleOverlap(10, 10, 200)).toBeCloseTo(0); // 'nonoverlapping circles test');

  expect(circleOverlap(10, 10, 0)).toBeCloseTo(Math.PI * 10 * 10); // 'full overlapping circles test');

  expect(circleOverlap(10, 5, 5)).toBeCloseTo(Math.PI * 5 * 5);
});

test('distanceFromIntersectArea', () => {
  function testDistanceFromIntersectArea(r1, r2, overlap) {
    var distance = distanceFromIntersectArea(r1, r2, overlap);
    expect(circleOverlap(r1, r2, distance)).toBeCloseTo(overlap);
  }

  testDistanceFromIntersectArea(1.9544100476116797, 2.256758334191025, 11);

  testDistanceFromIntersectArea(111.06512962798197, 113.32348546565727, 1218);

  testDistanceFromIntersectArea(44.456564007075, 149.4335753619362, 2799);

  testDistanceFromIntersectArea(592.89, 134.75, 56995);

  testDistanceFromIntersectArea(139.50778247443944, 32.892784970851956, 3399);

  testDistanceFromIntersectArea(4.886025119029199, 5.077706251929807, 75);
});

test('circleCircleIntersection', () => {
  var testIntersection = function (p1, p2) {
    var points = circleCircleIntersection(p1, p2);
    // make sure that points are appropriately spaced
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      expect(distance(point, p1)).toBeCloseTo(p1.radius);
      expect(distance(point, p2)).toBeCloseTo(p2.radius);
    }

    return points;
  };

  // fully contained
  expect(circleCircleIntersection({ x: 0, y: 3, radius: 10 }, { x: 3, y: 0, radius: 20 })).toHaveLength(0);

  // fully disjoint
  expect(circleCircleIntersection({ x: 0, y: 0, radius: 10 }, { x: 21, y: 0, radius: 10 })).toHaveLength(0);

  // midway between 2 points on y axis
  var points = testIntersection({ x: 0, y: 0, radius: 10 }, { x: 10, y: 0, radius: 10 }, 'test midway intersection');
  expect(points).toHaveLength(2);
  expect(points[0].x).toBeCloseTo(5);
  expect(points[1].x).toBeCloseTo(5);
  expect(points[0].y).toBeCloseTo(-1 * points[1].y);
  // failing case from input
  var points = testIntersection({ radius: 10, x: 15, y: 5 }, { radius: 10, x: 20, y: 0 }, 'test intersection2');
  expect(points).toHaveLength(2);
});

test('disjointCircles', function () {
  // each one of these circles overlaps all the others, but the total overlap is still 0
  var circles = [
    { x: 0.909, y: 0.905, radius: 0.548 },
    { x: 0.765, y: 0.382, radius: 0.703 },
    { x: 0.63, y: 0.019, radius: 0.449 },
    { x: 0.21, y: 0.755, radius: 0.656 },
    { x: 0.276, y: 0.723, radius: 1.145 },
    { x: 0.141, y: 0.585, radius: 0.419 },
  ];

  var area = intersectionArea(circles);
  expect(area).toBe(0);

  // no intersection points, but the smallest circle is completely overlapped by each of the others
  circles = [
    { x: 0.426, y: 0.882, radius: 0.944 },
    { x: 0.24, y: 0.685, radius: 0.992 },
    { x: 0.01, y: 0.909, radius: 1.161 },
    { x: 0.54, y: 0.475, radius: 0.41 },
  ];

  expect(circles[3].radius * circles[3].radius * Math.PI).toBeCloseTo(intersectionArea(circles));
});

test('randomFailures', () => {
  var circles = [
      { x: 0.501, y: 0.32, radius: 0.629 },
      { x: 0.945, y: 0.022, radius: 1.015 },
      { x: 0.021, y: 0.863, radius: 0.261 },
      { x: 0.528, y: 0.09, radius: 0.676 },
    ],
    area = intersectionArea(circles);

  expect(Math.abs(area - 0.0008914)).toBeLessThan(0.0001);

  circles = [
    { x: 9.154829758385864, y: 0, size: 226, radius: 8.481629223064205 },
    { x: 5.806079662851866, y: 7.4438023223126795, size: 733, radius: 15.274853405932202 },
    { x: 9.484491297623553, y: 4.064806303558571, size: 332, radius: 10.280023453913834 },
    { x: 10.56492833796709, y: 3.0723147554880175, size: 244, radius: 8.812923024107548 },
  ];

  area = intersectionArea(circles);
  expect(area).toBeCloseTo(10.96362);
  circles = [
    { x: -0.0014183481763938425, y: 0.0006071174738860746, radius: 510.3115834996166 },
    { x: 875.0163281608848, y: 0.0007003612396158774, radius: 465.1793581792228 },
    { x: 462.7394999567192, y: 387.9359963330729, radius: 172.62633992134658 },
  ];
  area = intersectionArea(circles);
  expect(area).not.toBeNaN();
});

test('computeTextCentre', () => {
  var center = computeTextCentre([{ x: 0, y: 0, radius: 1 }], []);
  expect(center.x).toBeCloseTo(0);
  expect(center.y).toBeCloseTo(0);

  var center = computeTextCentre([{ x: 0, y: 0, radius: 1 }], [{ x: 0, y: 1, radius: 1 }]);
  expect(center.x).toBeCloseTo(0, 4);
  expect(center.y).toBeCloseTo(-0.5);
});

test('normalizeSolution', () => {
  // test two circles that are far apart
  var solution = [
    { x: 0, y: 0, radius: 0.5 },
    { x: 1e10, y: 0, radius: 1.5 },
  ];

  // should be placed close together
  var normalized = normalizeSolution(solution);
  // distance should be 2, but we space things out
  expect(distance(normalized[0], normalized[1])).toBeLessThan(2.1);
});

test('disjointClusters', () => {
  var input = [
    {
      x: 0.8047033110633492,
      y: 0.9396705999970436,
      radius: 0.47156485118903224,
    },
    {
      x: 0.7961132447235286,
      y: 0.014027722179889679,
      radius: 0.14554832570720466,
    },
    {
      x: 0.28841276094317436,
      y: 0.98081015329808,
      radius: 0.9851036085514352,
    },
    {
      x: 0.7689983483869582,
      y: 0.2899463507346809,
      radius: 0.7210563338827342,
    },
  ];

  var clusters = disjointCluster(input);
  expect(clusters).toHaveLength(1);
});
