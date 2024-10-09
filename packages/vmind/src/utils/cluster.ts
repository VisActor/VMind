export interface ClusterDataItem {
  id: string;
  value: number[];
}

export interface ClusterData {
  id: number;
  children: ClusterDataItem[];
}

export function jaccardSimilarity(columnA: number[], columnB: number[]) {
  if (columnA.length !== columnB.length) {
    throw new Error('Columns must be of the same length');
  }

  let intersection = 0;
  let union = 0;

  for (let i = 0; i < columnA.length; i++) {
    if (columnA[i] === 1 || columnB[i] === 1) {
      union++;
      if (columnA[i] === 1 && columnB[i] === 1) {
        intersection++;
      }
    }
  }

  return intersection / union;
}

function calculateClusterDistance(clusterA: ClusterData, clusterB: ClusterData) {
  let sumDistance = 0;

  for (const itemA of clusterA.children) {
    for (const itemB of clusterB.children) {
      const distance = 1 - jaccardSimilarity(itemA.value, itemB.value);
      sumDistance += distance;
    }
  }

  return sumDistance / (clusterA.children.length * clusterB.children.length);
}

export function calculateDistanceMatrix(data: ClusterData[]) {
  const n = data.length;
  const distanceMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  let minDistance = 1;
  const distancePair = [0, 0];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const distance = calculateClusterDistance(data[i], data[j]);
      distanceMatrix[i][j] = distance;
      distanceMatrix[j][i] = distance;
      if (distance < minDistance) {
        minDistance = distance;
        distancePair[0] = i;
        distancePair[1] = j;
      }
    }
  }

  return {
    distanceMatrix,
    minDistance,
    distancePair
  };
}
/**
 * Agglomerative Hierarchical Clustering, using jaccard similarity and average linkage
 * @param data
 */
export const agglomerativeHierarchicalClustering = (data: ClusterDataItem[], threshold: number = 0.4) => {
  const clusters: ClusterData[] = data.map((v, i) => ({ id: i, children: [v] }));
  const clusterMap: Map<string, number> = new Map();
  let hasMerged = true;
  while (hasMerged && clusters.length > 1) {
    hasMerged = false;
    // Initialize distances matrix and find min-distance pair
    const { minDistance, distancePair } = calculateDistanceMatrix(clusters);
    if (minDistance <= threshold) {
      const mergedCluster: ClusterData = {
        id: clusters.length,
        children: [...clusters[distancePair[0]].children, ...clusters[distancePair[1]].children]
      };
      clusters.splice(distancePair[0], 1);
      clusters.splice(distancePair[1] - 1, 1);
      clusters.push(mergedCluster);
      hasMerged = true;
    }
  }
  clusters.forEach((v, i) => {
    v.children.forEach(item => {
      clusterMap.set(item.id, i);
    });
  });
  return {
    clusters,
    clusterMap
  };
};
