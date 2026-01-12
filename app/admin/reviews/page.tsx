import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import { DeleteReviewButton } from "@/components/admin/delete-review-button"

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const page = Number(params.page) || 1
  const perPage = 10

  const { data: reviews, count } = await supabase
    .from("reviews")
    .select(
      `
      *,
      hotel:hotels(name),
      profile:profiles(full_name)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
        <p className="text-muted-foreground">Manage customer reviews</p>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">{count || 0} total reviews</p>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.profile?.full_name || "Anonymous"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {review.hotel?.name} · {new Date(review.created_at).toLocaleDateString()}
                      </p>
                      {review.title && <p className="font-medium">{review.title}</p>}
                      {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                    </div>
                    <DeleteReviewButton reviewId={review.id} />
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/reviews?page=${page - 1}`}>Previous</Link>
                      </Button>
                    )}
                    {page < totalPages && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/reviews?page=${page + 1}`}>Next</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
