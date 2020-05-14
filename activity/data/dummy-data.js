import Activity from '../model/activity';
// id, ownerId, title, time, location, participants, description

const ACTIVITIES = [
  new Activity(
    'p1',
    'u1',
    'Red Shirt',
    '2020-04-28',
    'https://cdn.pixabay.com/photo/2016/10/02/22/17/red-t-shirt-1710578_1280.jpg',
    ['u1', 'u2'],
    'A red t-shirt, perfect for days with non-red weather.',
    // 29.99
  ),
  new Activity(
    'p2',
    'u2',
    'Blue Carpet',
    '2020-04-28',
    'https://images.pexels.com/photos/6292/blue-pattern-texture-macro.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    ['u1'],
    'Fits your red shirt perfectly. To stand on. Not to wear it.',
    // 99.99
  ),
  new Activity(
    'p3',
    'u2',
    'Coffee Mug',
    '2020-04-28',
    'https://images.pexels.com/photos/160834/coffee-cup-and-saucer-black-coffee-loose-coffee-beans-160834.jpeg?cs=srgb&dl=bean-beans-black-coffee-160834.jpg&fm=jpg',
    ['p3'],
    'Can also be used for tea!',
    // 8.99
  ),
  new Activity(
    'p4',
    'u3',
    'The Book - Limited Edition',
    '2020-04-28',
    'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?cs=srgb&dl=blur-blurred-book-pages-46274.jpg&fm=jpg',
    ['p4'],
    "What the content is? Why would that matter? It's a limited edition!",
    // 15.99
  ),
  new Activity(
    'p5',
    'u3',
    'PowerBook',
    '2020-04-28',
    'https://get.pxhere.com/photo/laptop-computer-macbook-mac-screen-water-board-keyboard-technology-air-mouse-photo-airport-aircraft-tablet-aviation-office-black-monitor-keys-graphic-hardware-image-pc-exhibition-multimedia-calculator-vector-water-cooling-floppy-disk-phased-out-desktop-computer-netbook-personal-computer-computer-monitor-electronic-device-computer-hardware-display-device-448748.jpg',
    ['p5'],
    'Awesome hardware, crappy keyboard and a hefty price. Buy now before a new one is released!',
    // 2299.99
  ),
  new Activity(
    'p6',
    'u1',
    'Pen & Paper',
    '2020-04-28',
    'https://cdn.pixabay.com/photo/2015/10/03/02/14/pen-969298_1280.jpg',
    ['p6'],
    "Can be used for role-playing (not the kind of role-playing you're thinking about...).",
    // 5.49
  )
];

export default ACTIVITIES;