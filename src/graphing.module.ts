import {
  SpelunkedEdge,
  SpelunkedNode,
  SpelunkedTree,
} from './spelunker.interface';

export class GraphingModule {
  static graph(tree: SpelunkedTree[]): SpelunkedNode {
    const nodeMap = tree.reduce(
      (map, module) =>
        map.set(module.name, {
          dependencies: new Set(),
          dependents: new Set(),
          module,
        }),
      new Map<string, SpelunkedNode>(),
    );

    nodeMap.forEach((node) => this.findDependencies(node, nodeMap));

    return this.findRoot(nodeMap);
  }

  static getEdges(root: SpelunkedNode): SpelunkedEdge[] {
    return this.getEdgesRecursively(root);
  }

  private static findDependencies(
    node: SpelunkedNode,
    nodeMap: Map<string, SpelunkedNode>,
  ): SpelunkedNode[] {
    return node.module.imports.map((m) => {
      const dependency = nodeMap.get(m);
      if (!dependency) throw new Error(`Unable to find ${m}!`);

      node.dependencies.add(dependency);
      dependency.dependents.add(node);

      return dependency;
    });
  }

  private static findRoot(nodeMap: Map<string, SpelunkedNode>): SpelunkedNode {
    const root = [...nodeMap.values()].find((n) => n.dependents.size === 0);

    if (!root) throw new Error('Unable to find root node');

    return root;
  }

  private static getEdgesRecursively(
    root: SpelunkedNode,
    depth = 0,
  ): SpelunkedEdge[] {
    if (depth > 20) return []; // TODO Smarter way to prune circular deps

    return [...root.dependencies.values()].flatMap((n) => [
      {
        from: root,
        to: n,
      },
      ...this.getEdgesRecursively(n, depth + 1),
    ]);
  }
}
