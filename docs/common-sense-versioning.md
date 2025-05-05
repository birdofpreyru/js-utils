# The Common Sense Versioning

**Not quite [Semantic Versioning (SemVer)][SemVer]**

> It is sad when instructions for using (mostly) three-number-segment version
> signatures are six pages long.

0.  The primary purpose of **MAJOR**.**MINOR**.**PATCH** version number is
    to hint the product consumer on time, efforts, and risks necessary to adopt
    the new product release. It is a hint, not a guarantee &mdash; no matter
    the rules, mistakes will happen, patch releases will break stuff, and
    thus following versioning rules does not cancel the need for adequate
    Quality Assurance (QA), locking-down, and tracking of the exact versions of
    tested dependencies in consumer's products.

1.  **PATCH** increments mean changes safe to adopt without any modifications in
    consumer's products &mdash; both backward-compatible internal changes, and
    backward-compatible additions of new functionality (_i.e._ both [SemVer]'s
    PATCH and MINOR updates).

2.  **MINOR** increments mean changes that require minor updates in consumer's
    products &mdash; simple, mechanical, local changes, that should not take
    much efforts and time (_i.e._ less severe of [SemVer]'s MAJOR updates).

3.  **MAJOR** increments mean (rare) changes that require major updates in
    consumer's products &mdash; global revisions of how the versioned product is
    consumed, and global re-works of how it should be consumed starting with
    the new major release (_i.e._ severe of [SemVer]'s MAJOR updates).

4.  Otherwise version numbers follow [SemVer] semantics, for compatibility with
    existing tools &mdash; they are compared starting with their left-most
    segment to the right-most one; increments of a segment are accompanied
    with reset to zero of all segments to the right of it; additional suffixes
    as `-alpha.0`, or `+1`, _etc._ are allowed and understood, in general, as
    special &laquo;risky&raquo; releases, which should be adopted at the risk of
    consumer, if he has consulted corresponding release notes, and knows what
    he is doing.

[SemVer]: https://semver.org
